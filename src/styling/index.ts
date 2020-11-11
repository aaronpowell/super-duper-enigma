import { mergeStyles } from "@fluentui/react";

export const mediaContainer = mergeStyles({
  position: "relative",
  height: "100%",
  width: "100%",
  background: "transparent",
});
export const localVideoContainerStyle = mergeStyles(mediaContainer, {
  width: "100%",
  height: "100%",
  transform: "rotateY(180deg)",
});
export const mediaGalleryStyle = mergeStyles({
  padding: "0.4375rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRight: "1px solid rgba(0,0,0,0.05)",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
});
export const mediaGalleryGridStyle = mergeStyles({
  height: "100%",
  display: "grid",
});
