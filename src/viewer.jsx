import React, { useEffect, useRef } from 'react';
import {MindARThree} from 'mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from 'three';

export default function Viewer() {
  const containerRef = useRef(null);

  useEffect(() => {
  let mindarThree; 
  let started = false;

  const start = async () => {
    mindarThree = new MindARThree({
      container: containerRef.current,
      imageTargetSrc: "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.0/examples/image-tracking/assets/card-example/card.mind"
    });

    const { renderer, scene, camera } = mindarThree;

    const anchor = mindarThree.addAnchor(0);
    const geometry = new THREE.PlaneGeometry(1, 0.55);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5
    });
    const plane = new THREE.Mesh(geometry, material);
    anchor.group.add(plane);

    await mindarThree.start();
    started = true;

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  start();

  return () => {
    if (mindarThree && started) {
      mindarThree.stop(); // cleanup safely
    }
  };
}, []);


  return (
    <div style={{width: "100%", height: "100%"}} ref={containerRef}>
    </div>
  )
}

