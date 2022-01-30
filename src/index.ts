@ClassDeco("hi")
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

const p = new P("a", 1);
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

function ClassDeco(value: string) {
  return function <T extends { new (...args: any[]): {} }>(constractor: T) {
    return class extends constractor {
      constructor(..._: any[]) {
        super();
        console.log(value);
      }
    };
  };
}

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

class Validate {
  @IsString
  @Required
  title: string;
  @IsString
  @Required
  price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}

function Required(t: any, name: string) {}

function IsString(t: any, name: string) {}
function IsNumber(t: any, name: string) {}

const form = document.getElementById("form")! as HTMLFormElement;
form.addEventListener("submit", onSubmit);

function onSubmit(event: Event) {
  event.preventDefault();

  const title = document.getElementById("t")! as HTMLInputElement;
  const price = document.getElementById("p")! as HTMLInputElement;

  const t = title.value;
  const p = price.value;

  const a = new Validate(t, +p);
  console.log(a);
}
