import Link from 'next/link';
import styles from './button.module.css';

const Button = (props) => {
  if (props.link) {
    return (
      <Link href={props.link}>
        <a className={styles.btn}>{props.children}</a>
      </Link>
    );
  }

  return (
    <button onClick={props.onClick} className={styles.btn}>
      {props.children}
    </button>
  );
};

{
  /* 클래스를 추가하려면 Link태그 안에 a태그를 추가해서 추가한 a태그에 넣어야 한다. 
  이때 href는 작성할 필요가 없고 Link가 알아서 추가해준다. 
  원래 Link태그는 자체적으로 a태그를 렌더링하지만 추가된 앵커태그가 있다면 추가된 태그만 렌더링한다. */
}

export default Button;
