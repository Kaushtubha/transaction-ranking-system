import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { getRanking } from '../api';

function PodiumBar({ rank, score, userId, position, color, onHover }) {
  const meshRef = useRef();
  // Animate the height based on score
  const targetHeight = Math.max((score / 100) * 5, 0.5);
  const [currentHeight, setCurrentHeight] = useState(0.1);

  useFrame((state, delta) => {
    if (currentHeight < targetHeight) {
      setCurrentHeight((prev) => Math.min(prev + delta * 2, targetHeight));
    }
    // Subtle rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <mesh 
          ref={meshRef} 
          position={[0, currentHeight / 2, 0]}
          onPointerOver={(e) => { e.stopPropagation(); onHover(true); }}
          onPointerOut={(e) => { e.stopPropagation(); onHover(false); }}
        >
          <boxGeometry args={[1.5, currentHeight, 1.5]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.5} 
            roughness={0.2} 
            metalness={0.8} 
          />
        </mesh>
        
        {/* Floating Rank Number above the bar */}
        <Text
          position={[0, currentHeight + 0.8, 0]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor={color}
        >
          #{rank}
        </Text>
        
        {/* User ID below the bar */}
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {userId}
        </Text>
      </Float>
    </group>
  );
}

function Scene({ rankings, setTooltipData }) {
  // Use a modern neon palette
  const colors = ['#bc13fe', '#00f3ff', '#ff3366', '#00ff66', '#ffaa00'];

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, 5, -10]} intensity={2} color="#00f3ff" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {rankings.map((user, idx) => {
        // Arrange in a semi-circle
        const angle = (idx / Math.min(rankings.length, 10)) * Math.PI - Math.PI/2;
        const radius = 5;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - 2;
        
        return (
          <PodiumBar 
            key={user.userId}
            rank={user.rank}
            score={user.score}
            userId={user.userId}
            position={[x, -2, z]}
            color={colors[idx % colors.length]}
            onHover={(isHovering) => {
              if (isHovering) {
                setTooltipData(user);
              } else {
                setTooltipData(null);
              }
            }}
          />
        );
      })}
      
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2} 
        minDistance={5} 
        maxDistance={20} 
      />
    </>
  );
}

export default function Ranking3D() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltipData, setTooltipData] = useState(null);
  
  // Mouse position for tooltip
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const data = await getRanking();
        setRankings(data);
      } catch (err) {
        console.error("Failed to fetch rankings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
    
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 className="text-neon" style={{ fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Live Leaderboard</h2>
        <p style={{ color: '#888' }}>Interact with the 3D podium. Hover over bars for score breakdown.</p>
      </div>

      <div className="canvas-container">
        {loading ? (
          <div className="flex-center" style={{ height: '100%' }}>
            <h2 className="text-neon animate-pulse">Loading 3D Data...</h2>
          </div>
        ) : rankings.length === 0 ? (
          <div className="flex-center" style={{ height: '100%' }}>
            <h2>No transactions yet to rank.</h2>
          </div>
        ) : (
          <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
            <Scene rankings={rankings} setTooltipData={setTooltipData} />
          </Canvas>
        )}
      </div>

      {/* Custom HTML Tooltip */}
      {tooltipData && (
        <div 
          className="tooltip" 
          style={{ 
            left: mousePos.x, 
            top: mousePos.y 
          }}
        >
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{tooltipData.userId} (Rank #{tooltipData.rank})</h3>
          <p className="text-neon" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Score: {tooltipData.score}
          </p>
          <div style={{ fontSize: '0.8rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p>Volume: {tooltipData.breakdown.amount}</p>
            <p>Frequency: {tooltipData.breakdown.count}</p>
            <p>Recency: {tooltipData.breakdown.recency}</p>
            <p>Reliability: {tooltipData.breakdown.reliability}</p>
          </div>
        </div>
      )}
    </div>
  );
}
