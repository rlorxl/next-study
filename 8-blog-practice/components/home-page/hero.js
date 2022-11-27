import classes from './hero.module.css';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image
          src='/images/site/memoticon.jpeg'
          alt='profile'
          width={300}
          height={300}
        />
      </div>
      <h1>Hello, I'm Zoala</h1>
      <p>FE Developer</p>
    </section>
  );
};

export default Hero;
