import { GameState } from './types';

export function determineEnding(state: GameState): string {
  if (state.walletShield >= 90 && state.identityShield >= 90 && state.familyTrust >= 90) {
    return "e_gatekeeper"; // Người Gác Cổng
  }
  if (state.walletShield >= 50 && state.identityShield >= 50 && state.familyTrust >= 50) {
    return "e_narrow_escape"; // Thoát Bẫy Trong Gang Tấc
  }
  if (state.walletShield >= 50 || state.identityShield >= 50 || state.familyTrust >= 50) {
    return "e_open_vulnerability"; // Một Lỗ Hổng Còn Mở
  }
  return "e_loss_of_control"; // Mất Kiểm Soát
}
