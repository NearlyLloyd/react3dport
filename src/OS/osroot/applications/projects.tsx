export function Projects() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Projects</h1>
      <p>Although there are dozens of projects I've worked on,
         here are a few that I'm particularly proud of:</p>
      <div className="textWrapper">
        <h2>3D SPA Portfolio</h2>
        <p>React, Three.js, typescript</p>
        <p>
          This is a single-page application built with React and Three.js of which you are viewing right now! The application features a 3D environment where users can navigate through different sections to learn more about me, my experience, and my projects. I designed and implemented the 3D models, animations, and interactive elements to create an immersive user experience.
        </p>
      </div>
              <div className="textWrapper">
          <h2>Game Prototypes</h2>
          <p>Unity, C#, HLSL, ShaderGraph</p>
          <p>There are genuinely so many to list, so enjoy a few screenshots of each project!</p>
        </div>
    </div>
  );
}
