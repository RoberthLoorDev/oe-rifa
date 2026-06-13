import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface DrawRouletteProps {
  eligibleNumbers: number[];
  targetNumber?: number;
  targetName?: string;
  animating: boolean;
  onAnimationComplete: () => void;
}

const CELL_HEIGHT = 80;
const VISIBLE_CELLS = 3;
const WINDOW_HEIGHT = CELL_HEIGHT * VISIBLE_CELLS;
const CENTER_INDEX = 1;
const REEL_LENGTH = 40;

function fmt(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function buildReel(numbers: number[], target: number): number[] {
  if (numbers.length === 0) return [target, target, target];
  const reel: number[] = [];

  for (let i = 0; i < REEL_LENGTH; i++) {
    let n = numbers[Math.floor(Math.random() * numbers.length)];
    if (i > REEL_LENGTH - 4 && n === target && numbers.length > 1) {
      const others = numbers.filter((x) => x !== target);
      n = others[Math.floor(Math.random() * others.length)];
    }
    reel.push(n);
  }

  reel.push(target);

  for (let i = 0; i < CENTER_INDEX; i++) {
    reel.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }

  return reel;
}

const PARTICLE_COLORS = ['#3B6FFF', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899'];

function Particle({ index, active }: { index: number; active: boolean }) {
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    if (!active) {
      opacity.value = 0;
      return;
    }
    const angle = (index / 14) * Math.PI * 2;
    const dist = 60 + Math.random() * 70;
    const delay = Math.random() * 300;

    opacity.value = withSequence(
      withTiming(0, { duration: delay }),
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 1200 }),
    );
    x.value = withSequence(
      withTiming(0, { duration: delay }),
      withTiming(Math.cos(angle) * dist, { duration: 1000, easing: Easing.out(Easing.quad) }),
    );
    y.value = withSequence(
      withTiming(0, { duration: delay }),
      withTiming(Math.sin(angle) * dist + 40, { duration: 1000, easing: Easing.out(Easing.quad) }),
    );
    scale.value = withSequence(
      withTiming(0.5, { duration: delay }),
      withSpring(1.2, { damping: 6 }),
      withTiming(0, { duration: 800 }),
    );
  }, [active]);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
    opacity: opacity.value,
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
  }));

  return <Animated.View style={style} />;
}

export default function DrawRoulette({
  eligibleNumbers,
  targetNumber,
  targetName,
  animating,
  onAnimationComplete,
}: DrawRouletteProps) {
  const [reel, setReel] = useState<number[]>([]);
  const [showReel, setShowReel] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const wasAnimating = useRef(false);

  const scrollY = useSharedValue(0);
  const resultScale = useSharedValue(1);
  const resultOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  const triggerCelebration = () => {
    setCelebrating(true);
    resultScale.value = 0.3;
    resultOpacity.value = 0;
    resultScale.value = withSequence(
      withSpring(1.15, { damping: 5, stiffness: 180 }),
      withSpring(1, { damping: 10, stiffness: 120 }),
    );
    resultOpacity.value = withTiming(1, { duration: 250 });
    glowOpacity.value = withSequence(withTiming(0.5, { duration: 250 }), withTiming(0.12, { duration: 1500 }));
  };

  const finishAnimation = () => {
    setShowReel(false);
    triggerCelebration();
    onAnimationComplete();
  };

  useEffect(() => {
    if (animating && !wasAnimating.current && targetNumber !== undefined) {
      const newReel = buildReel(eligibleNumbers, targetNumber);
      setReel(newReel);
      setShowReel(true);
      setCelebrating(false);
      glowOpacity.value = 0;

      const targetIdx = newReel.length - 1 - CENTER_INDEX;
      const startPos = CENTER_INDEX * CELL_HEIGHT;
      const endPos = (CENTER_INDEX - targetIdx) * CELL_HEIGHT;

      scrollY.value = startPos;
      scrollY.value = withTiming(endPos, { duration: 3500, easing: Easing.out(Easing.exp) }, (finished) => {
        'worklet';
        if (finished) runOnJS(finishAnimation)();
      });
    }
    wasAnimating.current = animating;
  }, [animating, targetNumber]);

  useEffect(() => {
    if (!animating && targetNumber !== undefined && !celebrating && !wasAnimating.current) {
      triggerCelebration();
    }
  }, [targetNumber]);

  const reelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value }],
  }));

  const resultStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resultScale.value }],
    opacity: resultOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View className="relative mb-10 items-center justify-center">
      {celebrating && (
        <View style={{ position: 'absolute' }} pointerEvents="none">
          {Array.from({ length: 14 }).map((_, i) => (
            <Particle key={i} index={i} active />
          ))}
        </View>
      )}

      <View
        style={{
          width: 200,
          height: WINDOW_HEIGHT,
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        {showReel ? (
          <>
            <Animated.View style={reelStyle}>
              {reel.map((num, i) => (
                <View key={i} style={{ height: CELL_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 38, fontWeight: '900', color: '#0F172A', fontVariant: ['tabular-nums'] }}>
                    {fmt(num)}
                  </Text>
                </View>
              ))}
            </Animated.View>

            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: CELL_HEIGHT,
                backgroundColor: 'rgba(255,255,255,0.85)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: CELL_HEIGHT,
                backgroundColor: 'rgba(255,255,255,0.85)',
              }}
            />

            <View
              style={{
                position: 'absolute',
                top: CENTER_INDEX * CELL_HEIGHT,
                left: 0,
                right: 0,
                height: CELL_HEIGHT,
                backgroundColor: 'rgba(0,0,0,0.03)',
              }}
            />
          </>
        ) : celebrating && targetNumber !== undefined ? (
          <Animated.View style={[resultStyle, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 72, fontWeight: '900', color: '#0F172A', fontVariant: ['tabular-nums'] }}>
              {fmt(targetNumber)}
            </Text>
            {targetName && (
              <Animated.View entering={FadeIn.duration(400).delay(400)}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '800',
                    marginTop: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    textAlign: 'center',
                    paddingHorizontal: 16,
                  }}
                  numberOfLines={1}
                >
                  {targetName}
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 72, fontWeight: '900', color: '#E5E7EB' }}>?</Text>
          </View>
        )}
      </View>
    </View>
  );
}
