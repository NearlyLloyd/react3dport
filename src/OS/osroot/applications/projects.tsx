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
      {/* Cluster analysis for ML models */}
      <div className="textWrapper">
        <h2>Cluster Analysis for ML Models</h2>
        <p>Python, Scikit-learn, Matplotlib, PCA analysis</p>
        <p>For a ML project, I implemented a cluster analysis to group similar data points in a wine dataset and visualize the results using Matplotlib.
          There is a writup available for more details on request.</p>
        <img width="100%" className="borderedImg" src="/images/projects/clustering/pcacluster.png" alt="Cluster Analysis Visualization" />
        <p>This data would be ready to be fed into a machine learning model to predict the region a given wine came from.</p>
      </div>
      {/*VNA Search The collection*/}
      {/* 3D Raycast Renderer*/}
      {/* Game Prototypes: */}
      <div className="textWrapper">
        <h2>Game Prototypes</h2>
        <p>Unity, C#, HLSL, ShaderGraph</p>
        <p>There are genuinely so many to list, so enjoy a few screenshots of each project!</p>
        <div className="textWrapper" style={{ textAlign: "center", backgroundColor: "rgb(0, 0, 0, 0.2)", padding: "16px" }}>
          <h3>"SurvivalAspects"</h3>
          <p>A survival game prototype built in Unity with C# and a normal based outline shader.</p>
          <img width="100%" className="borderedImg" src="/images/projects/unity/survivalaspects.png" alt="SurvivalAspects Screenshot" />
        </div>
        <div className="textWrapper" style={{ textAlign: "center", backgroundColor: "rgb(0, 0, 0, 0.2)", padding: "16px" }}>
          <h3>"Voxel Dungeon Crawler"</h3>
          <p>Procedural dungeon generation, weapon systems, inventory, interactive elements.</p>
          <img width="100%" className="borderedImg" src="/images/projects/unity/Voxel-dungeon-crawler.png" alt="SurvivalAspects Screenshot" />
        </div>
        <div className="textWrapper" style={{ textAlign: "center", backgroundColor: "rgb(0, 0, 0, 0.2)", padding: "16px" }}>
          <h3>Scharr operator outline filter</h3>
          <p>ShaderGraph, HLSL Components using depth and normals mixed for accurate edge detection.</p>
          <img width="100%" className="borderedImg" src="/images/projects/unity/scharroperator.png" alt="SurvivalAspects Screenshot" />
        </div>
      </div>
    </div>
  );
}
