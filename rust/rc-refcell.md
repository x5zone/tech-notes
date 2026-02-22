# Rc<RefCell<T>> - 运行时读写锁

## Rc：引用计数智能指针

`Rc<T>`（Reference Counting）允许多个所有者共享同一份数据。当最后一个所有者被释放时，数据才会被丢弃。

```rust
use std::rc::Rc;

let data = Rc::new(42);
let a = Rc::clone(&data);  // 引用计数 +1
let b = Rc::clone(&data);  // 引用计数 +1
// data, a, b 都指向同一份数据
// 当三者都离开作用域，数据才会被释放
```

**适用场景**：需要在多个地方共享只读数据，且无法确定哪个地方最后使用。

## RefCell：内部可变性

`RefCell<T>` 将借用检查从编译期推迟到运行时，实现了「内部可变性」——通过共享引用获取可变引用。

```rust
use std::cell::RefCell;

let cell = RefCell::new(42);

// borrow()：共享借用（读）
let r1 = cell.borrow();   // OK
let r2 = cell.borrow();   // OK，多读允许
drop(r1);
drop(r2);

// borrow_mut()：可变借用（写）
let mut w = cell.borrow_mut();  // OK，独占写
*w = 100;
```

**违反借用规则时**：

```rust
let cell = RefCell::new(42);

let r = cell.borrow();        // 读锁
let w = cell.borrow_mut();    // 运行时 panic！
// 错误：already borrowed: BorrowMutError
```

## 组合使用

`Rc` 提供共享所有权，`RefCell` 提供内部可变性，两者结合实现「多处共享 + 可修改」：

```rust
use std::rc::Rc;
use std::cell::RefCell;

let shared = Rc::new(RefCell::new(vec![1, 2, 3]));

let a = Rc::clone(&shared);
let b = Rc::clone(&shared);

// a 读
let r = a.borrow();
println!("{:?}", *r);

// b 写（注意：必须在 r 被 drop 之后）
drop(r);
b.borrow_mut().push(4);
```

## 比喻：运行时读写锁

对 `Rc<RefCell<T>>` 做个比喻：我们不妨设想它是一种特殊的运行时「rw_lock」，再多指针指向该 rw_lock 也毫无所谓（Rc 共享所有权），它唯一要保证的就是「rw_lock」的语义（所以重点是申请锁的操作如读 borrow，写 borrow_mut），多读或唯一写都可以，但是多写（或读写同时）就违反语义 panic 掉了（如连续两次调用 borrow_mut）。

这就像在 rw_lock 持有读锁时尝试获取写锁——语义上不允许，程序直接崩溃。区别在于真正的 `RwLock` 会阻塞等待，而 `RefCell` 选择 panic 来表达冲突。
