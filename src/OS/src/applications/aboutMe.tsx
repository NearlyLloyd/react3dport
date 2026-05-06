export default function AboutMe() {
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Lloyd Falltrick</h1>
      <div className="textWrapper">
        <h2>Software Engineer and University Student</h2>
        <p>Thank you for taking the time to take a look at my portfolio!</p>
        <p>
          I am a Brighton based software engineer doing a Computer Science
          degree at the University of Brighton.
        </p>
        <p>
          {" "}
          Currently working at Outthink as a Software Engineer Intern, where I
          am developing my skills in React, TypeScript, Node.js and Cloud
          Services like Azure. I have a passion for game development and have
          experience with game engines and graphics programming. I am always
          looking to learn new technologies and improve my skills, and I am
          excited to see where my career in software engineering takes me!
          <p>
            I like to participate in hackathons and local coding events, one of
            which I even presented at.
          </p>
          <figure>
            <img
              className="borderedImg"
              src="src\OS\assets\images\3dwebtalk.png"
              alt="Presentation"
              width="100%"
            />
            <figcaption style={{ textAlign: "center" }}>
              Me presenting at a 3D Web Talk in Brighton.
            </figcaption>
          </figure>
        </p>
      </div>
      <h1 style={{ textAlign: "center" }}>
        <a href="src\OS\assets\Lloyd_Falltrick_CV.pdf" download>
          Download CV Here
        </a>
      </h1>
      <div className="textWrapper">
        <h2>Hobbies and Interests</h2>
        <h3>Music and (much newer) Drumming</h3>
        <figure>
          <img
            className="borderedImg"
            src="src\OS\assets\images\drumming.jpg"
            alt="Drumming"
            width="100%"
          />
          <figcaption style={{ textAlign: "center" }}>
            Unfortunately, I don't have a better picture of me drumming yet.
          </figcaption>
        </figure>
        <h3>
          Games programming, specifically in Unity and Unreal Engine (or writing
          the engine myself)
        </h3>
        <figure>
          <img
            className="borderedImg"
            src="src\OS\assets\images\javaraycast3d.png"
            alt="Java Raycast 3D"
            width="100%"
          ></img>
          <figcaption style={{ textAlign: "center" }}>
            Java 3D Raycast Engine written from scratch by yours truly :){" "}
          </figcaption>
        </figure>
      </div>
    </>
  );
}
