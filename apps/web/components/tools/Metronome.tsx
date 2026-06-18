"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, FieldLabel, TextInput } from "@music/ui";

export function Metronome({ defaultBpm }: { defaultBpm?: number | null }) {
  const [bpm, setBpm] = useState(defaultBpm ?? 72);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const tick = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new AudioContext();
      }
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.08;
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio unavailable — visual-only is fine.
    }
  }, []);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    const ms = Math.round(60_000 / Math.max(20, Math.min(240, bpm)));
    tick();
    intervalRef.current = setInterval(tick, ms);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, bpm, tick]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      void audioRef.current?.close();
    };
  }, []);

  return (
    <Card className="space-y-3">
      <div>
        <h3 className="font-display text-base text-primary">Metronome</h3>
        <p className="mt-0.5 text-xs text-muted">A gentle pulse — not a target to hit.</p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-24">
          <FieldLabel htmlFor="metro-bpm">BPM</FieldLabel>
          <TextInput
            id="metro-bpm"
            type="number"
            inputMode="numeric"
            min={20}
            max={240}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value) || 72)}
            disabled={running}
          />
        </div>
        <Button type="button" size="sm" onClick={() => setRunning((r) => !r)}>
          {running ? "Stop" : "Start"}
        </Button>
      </div>
    </Card>
  );
}
