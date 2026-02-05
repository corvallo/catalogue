import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCatalogStore } from "@catalogue/shared/store/catalog-store";
import { decodeStoryId, encodeStoryId } from "@catalogue/shared/lib/story-id";

export const useStoryRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const selectedStoryId = useCatalogStore((state) => state.selectedStoryId);
  const storiesIndex = useCatalogStore((state) => state.storiesIndex);
  const lastHandledRoute = useRef<string | null>(null);

  const queryId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("id");
  }, [location.search]);

  useEffect(() => {
    const incomingId = routeId ? decodeStoryId(routeId) : queryId;
    if (!incomingId) return;
    if (lastHandledRoute.current === incomingId) return;
    const current = useCatalogStore.getState().selectedStoryId;
    if (incomingId !== current) {
      useCatalogStore.getState().setSelectedStoryId(incomingId);
    }
    lastHandledRoute.current = incomingId;
  }, [routeId, queryId]);

  useEffect(() => {
    if (!selectedStoryId) {
      if (storiesIndex?.stories.length) {
        const firstId = storiesIndex.stories[0].id;
        useCatalogStore.getState().setSelectedStoryId(firstId);
        navigate(`/story/${encodeStoryId(firstId)}`, { replace: true });
      }
      return;
    }

    if (storiesIndex && !storiesIndex.stories.find((story) => story.id === selectedStoryId)) {
      return;
    }

    const targetPath = `/story/${encodeStoryId(selectedStoryId)}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: false });
    }
  }, [selectedStoryId, storiesIndex, location.pathname, navigate]);
};
