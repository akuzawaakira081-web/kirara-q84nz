'use client';

import { useRef, useState, useCallback } from 'react';
import React from 'react';

export interface TransformState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface PointerInfo {
  x: number;
  y: number;
}

interface GestureSnapshot {
  startDist: number;
  startAngle: number;
  initialTransform: TransformState;
  initialMidX: number;
  initialMidY: number;
  pointers: Map<number, PointerInfo>;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 5.0;
const MIN_PINCH_DIST = 10; // px — ignore tiny pinch to prevent jitter

function getDistance(a: PointerInfo, b: PointerInfo): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getAngle(a: PointerInfo, b: PointerInfo): number {
  return Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
}

export function useOverlayTransform(locked: boolean) {
  const [transform, setTransform] = useState<TransformState>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
  });

  const activePointersRef = useRef<Map<number, PointerInfo>>(new Map());
  const gestureRef = useRef<GestureSnapshot | null>(null);
  // For single pointer drag
  const singleStartRef = useRef<{ px: number; py: number; tx: number; ty: number } | null>(null);

  const resetTransform = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1, rotation: 0 });
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (locked) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const count = activePointersRef.current.size;
      if (count === 1) {
        setTransform((prev) => {
          singleStartRef.current = {
            px: e.clientX,
            py: e.clientY,
            tx: prev.x,
            ty: prev.y,
          };
          return prev;
        });
        gestureRef.current = null;
      } else if (count === 2) {
        singleStartRef.current = null;
        const pts = Array.from(activePointersRef.current.values());
        const dist = getDistance(pts[0], pts[1]);
        if (dist < MIN_PINCH_DIST) return;
        const angle = getAngle(pts[0], pts[1]);
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;
        setTransform((prev) => {
          gestureRef.current = {
            startDist: dist,
            startAngle: angle,
            initialTransform: { ...prev },
            initialMidX: midX,
            initialMidY: midY,
            pointers: new Map(activePointersRef.current),
          };
          return prev;
        });
      }
    },
    [locked]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (locked) return;
      if (!activePointersRef.current.has(e.pointerId)) return;
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const count = activePointersRef.current.size;
      if (count === 1 && singleStartRef.current) {
        const { px, py, tx, ty } = singleStartRef.current;
        const dx = e.clientX - px;
        const dy = e.clientY - py;
        setTransform((prev) => ({ ...prev, x: tx + dx, y: ty + dy }));
      } else if (count === 2 && gestureRef.current) {
        const pts = Array.from(activePointersRef.current.values());
        const dist = getDistance(pts[0], pts[1]);
        const angle = getAngle(pts[0], pts[1]);
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;

        const g = gestureRef.current;
        const scaleRatio = g.startDist > 0 ? dist / g.startDist : 1;
        const newScale = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, g.initialTransform.scale * scaleRatio)
        );
        const deltaAngle = angle - g.startAngle;
        const newRotation = g.initialTransform.rotation + deltaAngle;
        const dx = midX - g.initialMidX;
        const dy = midY - g.initialMidY;

        setTransform({
          x: g.initialTransform.x + dx,
          y: g.initialTransform.y + dy,
          scale: newScale,
          rotation: newRotation,
        });
      }
    },
    [locked]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (locked) return;
      activePointersRef.current.delete(e.pointerId);
      if (activePointersRef.current.size === 0) {
        gestureRef.current = null;
        singleStartRef.current = null;
      } else if (activePointersRef.current.size === 1) {
        gestureRef.current = null;
        const remaining = Array.from(activePointersRef.current.values())[0];
        setTransform((prev) => {
          singleStartRef.current = {
            px: remaining.x,
            py: remaining.y,
            tx: prev.x,
            ty: prev.y,
          };
          return prev;
        });
      }
    },
    [locked]
  );

  return {
    transform,
    resetTransform,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
