import { LogisticsNotify } from './LogisticsNotify.js'

// Reverse logistics notifications typically have similar structure but different fields
export class ReturnLogisticsNotify extends LogisticsNotify {
  // Inherits static verify and parse methods
  // Can override if logic differs, but typically CheckMacValue logic is identical
}
