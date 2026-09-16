// Provides the airy social-network illustration used by the public auth pages.

import { AtSign, BarChart3, Camera, MessageCircle, Send } from "lucide-react";

// Renders a connected set of content and community signals without relying on external artwork.
export function AuthNetworkIllustration() {
  return (
    <div className="auth-network-illustration" aria-hidden="true">
      <span className="auth-network-line auth-network-line-one" />
      <span className="auth-network-line auth-network-line-two" />
      <span className="auth-network-line auth-network-line-three" />
      <span className="auth-network-line auth-network-line-four" />
      <span className="auth-network-line auth-network-line-five" />
      <span className="auth-network-orb auth-network-orb-one" />
      <span className="auth-network-orb auth-network-orb-two" />
      <span className="auth-network-orb auth-network-orb-three" />
      <div className="auth-network-node auth-network-node-camera"><Camera size={31} strokeWidth={1.6} /></div>
      <div className="auth-network-node auth-network-node-send"><Send size={31} strokeWidth={1.6} /></div>
      <div className="auth-network-node auth-network-node-chart"><BarChart3 size={31} strokeWidth={1.6} /></div>
      <div className="auth-network-node auth-network-node-message"><MessageCircle size={31} strokeWidth={1.6} /></div>
      <div className="auth-network-node auth-network-node-at"><AtSign size={31} strokeWidth={1.6} /></div>
    </div>
  );
}
