import React from "react";
import type { ReactNode } from "react";
import { useDebugMode } from "../hooks/useDebugMode";

interface DebugContainerProps {
	children: ReactNode;
}

const DebugContainer: React.FC<DebugContainerProps> = ({ children }) => {
	const debugMode = useDebugMode();
	if (!debugMode) return null;
	return <>{children}</>;
};

export default DebugContainer;