import { useEffect, useState } from "react";
import "./metaballs.css";

interface IMetaball {
  id: number;
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function Metaballs() {
  const [metaballs, setMetaballs] = useState<IMetaball[]>([]);

  useEffect(() => {
    const array = Array.from(
      { length: 4 },
      (_, id) =>
        ({
          id: id,
          radius: 500,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 100,
          vy: (Math.random() - 0.5) * 100,
        }) as IMetaball,
    );
    setMetaballs(array);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetaballs((prevMetaballs) => {
        return prevMetaballs.map((ball) => {
          if (
            ball.x < -ball.radius ||
            ball.x > window.innerWidth + ball.radius / 2
          ) {
            ball.vx = -ball.vx;
          }
          if (
            ball.y < -ball.radius ||
            ball.y > window.innerHeight + ball.radius / 2
          ) {
            ball.vy = -ball.vy;
          }

          ball.x = ball.x + ball.vx * 0.01;
          ball.y = ball.y + ball.vy * 0.01;

          return ball;
        });
      });
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="outer-metaballs-container">
      <div className="inner-metaballs-container">
        {metaballs.map((ball) => (
          <div
            className="metaball"
            key={ball.id}
            style={{
              left: ball.x,
              top: ball.y,
              width: ball.radius,
              height: ball.radius,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Metaballs;
