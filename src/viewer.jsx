import React, { useEffect, useRef, useState } from 'react';
import {MindARThree} from 'mind-ar/dist/mindar-image-three.prod.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

export default function Viewer() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.3);
  const [rotationY, setRotationY] = useState(0); 
  const modelRef = useRef(null);
  const scaleRef = useRef(scale);
  const rotationYRef = useRef(rotationY);


  // const loader = new GLTFLoader();

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    rotationYRef.current = rotationY;
  }, [rotationY]);

  useEffect(() => {
    let mindarThree; 
    let started = false;

    const start = async () => {
      mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: "/tam.mind"
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
      // anchor.group.add(plane);

      new GLTFLoader().load('/test.glb', (gltf) => {
        const model = gltf.scene;
        modelRef.current = model
        model.scale.set(0.1, 0.1, 0.1); 
        // model.scale.set(scale, scale, scale); // Use the state variable for scale
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0); 
        // model.rotation.y = rotationY; // Use the state variable for rotation
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        anchor.group.add(model);
      });

      

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 1, 2);
      scene.add(directionalLight);

      await mindarThree.start();
      started = true;

      renderer.setAnimationLoop(() => {
        if (modelRef.current) {
          modelRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
          modelRef.current.rotation.y = rotationYRef.current;
        }

        renderer.render(scene, camera);

      });
    };

    start();

    

    return () => {
      if (mindarThree && started) {
        mindarThree.stop(); // cleanup safely
      }
    };
  }, [ ]);

  

 
  


  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
      {/* The container for the MindARThree instance */}
      <div style={{width: "100%", height: "100%"}} ref={containerRef}>
      </div>
      <div style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '1rem',
            borderRadius: '12px',
            zIndex: 10
        }}>
            <div>
            <label>Scale: {scale.toFixed(2)}</label>
            <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                style={{ width: '100%' }}
            />
            </div>
            <div style={{ marginTop: '1rem' }}>
            <label>Rotation: {(rotationY * (180 / Math.PI)).toFixed(0)}°</label>
            <input
                type="range"
                min="0"
                max={(2 * Math.PI).toFixed(2)}
                step="0.01"
                value={rotationY}
                onChange={(e) => setRotationY(parseFloat(e.target.value))}
                style={{ width: '100%' }}
            />
            </div>
        </div>
    </div>
  )
}

