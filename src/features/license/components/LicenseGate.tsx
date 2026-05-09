import type { ReactNode } from 'react';

interface LicenseGateProps {
  children: ReactNode;
}

export function LicenseGate({ children }: LicenseGateProps) {
  // TODO(Phase 2): check license tier
  return <>{children}</>;
}