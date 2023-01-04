import { useParams } from "@solidjs/router";
import { FaSolidArrowLeft } from "solid-icons/fa";
import { createEffect, createResource, onMount, Show } from "solid-js";
import { getGlideById } from "../api/glide";
import GlidePost from "../components/glides/GlidePost";
import PaginatedGlides from "../components/glides/PaginatedGlides";
import MainLayout from "../components/layouts/Main";
import { CenteredDataLoader } from "../components/utils/DataLoader";
import Messenger from "../components/utils/Messenger";
import useSubglides from "../hooks/useSubglides";
import { Glide } from "../types/Glide";
import { User } from "../types/User";

const GlideDetail = () => {
  const params = useParams();
  const [data, {mutate}] = createResource(() => getGlideById(params.id, params.uid));
  const {store, page, loadGlides, addGlide} = useSubglides();
  const user = () => data()?.user as User;

  createEffect(() => {
    const glide = data();
    if (!data.loading && !!glide && !!glide.lookup) {
      loadGlides(glide.lookup);
    }
  })

  const onGlideAdded = (newGlide?: Glide) => {
    const glide = data()!;

    mutate({
      ...glide,
      subglidesCount: glide.subglidesCount + 1
    });

    addGlide(newGlide);
  }

  return (
    <MainLayout pageTitle={
      <div onClick={() => history.back()}>
        <div class="flex-it flex-row items-center text-xl cursor-pointer">
          <FaSolidArrowLeft />
          <div class="ml-5 font-bold">Back</div>
        </div>
      </div>
    }>
      <Show 
        when={!data.loading}
        fallback={<CenteredDataLoader />}
      >
        <GlidePost glide={data()!} />
        <div class="p-4 border-b-1 border-solid border-gray-700">
          <div class="text-sm italic text-gray-300 underline mb-2">
            Answering to {user().nickName}
          </div>
          <Messenger 
            answerTo={data()?.lookup}
            showAvatar={false}
            onGlideAdded={onGlideAdded} 
          />
        </div>
        <PaginatedGlides 
          page={page}
          pages={store.pages}
          loading={store.loading}
          loadMoreGlides={() => Promise.resolve()}
        />
      </Show>
    </MainLayout>
  )
}

export default GlideDetail;
