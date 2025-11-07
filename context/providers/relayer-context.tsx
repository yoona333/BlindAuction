'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type FhevmInstance = any; // 用 SDK 实际类型替换

type RelayerCtx = { instance: FhevmInstance | null };
const Ctx = createContext<RelayerCtx>({ instance: null });

export function RelayerProvider({ children }: { children: React.ReactNode }) {
  const [instance, setInstance] = useState<FhevmInstance | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // ⬇️ 关键：在客户端再加载 SDK（避免 SSR 阶段访问 window）
      const { initSDK, createInstance, SepoliaConfig } = await import('@zama-fhe/relayer-sdk/bundle');

      await initSDK(); // 先加载 TFHE 的 WASM
      const cfg = { ...SepoliaConfig, network: (window as any).ethereum };
      const inst = await createInstance(cfg);
      if (mounted) setInstance(inst);
    })();

    return () => { mounted = false; };
  }, []);

  const value = useMemo(() => ({ instance }), [instance]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRelayer() {
  return useContext(Ctx);
}