## Decorator 연습

## setting

- tsc --init
- experimentalDecorators": true
  emitDecoratorMetadata": true

- 타입스크립트 컴파일 와치모드 : tsc -w
- html 파일 와치모드 : lite-server

## Intro

- 데코레이터는 클레스가 인스턴스화만 되면 맨 처음 실행된다.

```
//target 이 콘솔에 출력된다.

function Logger(target: Function) {
  console.log(target);
}

@Logger
class Person {
  name = "max";

  constructor() {
    console.log("111");
  }
}

const p = new Person();
```

- 데코레이터에 () 실행이 붙는것은 반환할 함수가 있다는 뜻이다. 이것을 데코레이터 팩토리라고 한다.

```
//constractor와 hi가 출력된다.
function Logger(hi: string) {
  return function (constractor: Function) {
    console.log(constractor);
    console.log(hi);
  };
}

@Logger("hi")
class Person {
  name = "max";

  constructor() {
    console.log("111");
  }
}

const p = new Person();

```

- 화면에 이런것도 그릴수 있다.

```
function WithTemplate(id: string, template: string) {
  return function (constractor: any) {
    const root = window.document.getElementById(id)! as HTMLDivElement;
    root.innerHTML = template;

    const p = new constractor();

    const e = document.querySelector("h1")!;
    e.innerText = p.name;
  };
}

@WithTemplate("root", "<h1>zz</h1>")
class Person {
  name = "max";

  constructor() {
    console.log("111");
  }
}

const p = new Person();

console.log("hi");
```

- class decorator 실행 순서는
- 팩토리 안에 있는것은 클레스에 가까운 순서대로 (2->1);
- 팩토리 바깥은 아래에서 위로(1->2)로 실행된다.
- 결과적으로 1->2->2->1순서다.

```

function Logger() {
  console.log(1);
  return function (_: Function) {
    console.log(1);
  };
}

function WithTemplate() {
  console.log(2);
  return function (_: any) {
    console.log(2);
  };
}

@Logger()
@WithTemplate()
class Person {
  name = "max";

  constructor() {}
}

```

- 데코레이터는 인수의 종류에 따라서 사용하는 곳이 달라진다

```
class P {
  @Log //타겟은 클레스   네임은 속성이 된다 값이 아님 키 값임.
  title: string;
  private price: number;

  @Log2 //타켓은 글레스   네임은 setPrice  descraptor 은 객체(중요)가된다.
  set setPrice(val: number) {
    if (val > 0) {
      this.price = val;
    } else {
      throw new Error("greater than 0 ");
    }
  }
  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }

  @Log3 //타겟 클레스 네임 getWith descraptor 은 객체(중요) 가 된다.
  getWith(@Log4 tax: number) {
    //target 은 클레스 네임은 속해있는 함수(getWith) position 은 0 인덱스가 된다.
    return this.price * (1 + tax);
  }
}

function Log(target: any, propertyName: string | Symbol) {
  console.log(target);
  console.log(propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log3(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log4(target: any, name: string, position: number) {
  console.log(target);
  console.log(name);
  console.log(position);
}


```

## 데코레이터는 클레스를 인스턴스 화 하면 어디에 있던 간에 먼저 실행된다

- 속성 데코레이터, 메서드 데코레이터는 클레스에 넣어 놓기만 하면 이미 실행이 된다.
- 그러나 클레스 데코레이터는 인스턴스 화 될때 실행되게 할 수 도 있다 패토리에서 또 다른 클레스를 반환하면 된다.

```
function ClassDeco(value: string) {
  return function <T extends { new (...args: any[]): {} }>(constractor: T) {
    return class extends constractor {
      constructor(..._: any[]) {
        super();
        console.log(value);
      }
    };
  };
```

- 메서드를 부르거나 속성을 불러낼때 실행되는것이 아니다 그냥 new className() 할때 실행된다.
- 클레스 데코레이터는 뭔가를 반환 할 수 있다. 예)새로운 클레스
- 메서드 데코레이터는 뭔가를 반환 한 수 있다. 예)새로운 메서드

```
class Dummy {
  message = "hi";

  @Autobind
  onClick() {
    console.log(this.message);
  }
}

const b = document.querySelector("button")! as HTMLButtonElement;
const d = new Dummy();
b.addEventListener("click", d.onClick);

function Autobind(c: any, a_: string, descraptor: PropertyDescriptor) {
  const originalMethod = descraptor.value;
  const adjustDescraptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      //새로 추가될 함수가 들어가 있는 객체다
      const addFunc = originalMethod.bind(this); //여기 this 는 고정이다 무조건 c 를 가르킨다.
      return addFunc;
    },
  };
  return adjustDescraptor;
}

```

- 속성 데코레이터는 뭔가 반환 하나마나 무시된다.
