"use client";
import Loader from "./ui/Loader";

/**
 * Shows a loader while Convex queries are loading
 * @param {Object} props
 * @param {any} props.queryResult - The result from useQuery (undefined while loading)
 * @param {React.ReactNode} props.children - Content to show when loaded
 * @param {React.ReactNode} [props.fallback] - Custom fallback (defaults to Loader)
 */
export function QueryLoader({ queryResult, children, fallback }) {
  if (queryResult === undefined) {
    return (
      fallback || (
        <div className="min-h-[200px] flex items-center justify-center">
          <Loader size={20} label="Loading data" />
        </div>
      )
    );
  }
  return children;
}
