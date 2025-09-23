import "styled-components/native";
import { Theme } from "./theme";

declare module "styled-components/native" {
  // Faz com que o DefaultTheme use a interface Theme definida pelo projeto
  export interface DefaultTheme extends Theme {}
}
