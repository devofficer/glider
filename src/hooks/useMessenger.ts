import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useAuthState } from "../context/auth";
import { useUIDispatch } from "../context/ui";
import { GliderInputEvent, MessengerForm } from "../types/Form";



const useMessenger = () => {
  const {isAuthenticated, user} = useAuthState()!;
  const {addSnackbar} = useUIDispatch();
  const [loading, setLoading] = createSignal(false);
  const [form, setForm] = createStore<MessengerForm>({
    content: ""
  });

  const handleInput = (e: GliderInputEvent) => {
    const {name, value} = e.currentTarget;
    setForm(name, value);
  }

  const handleSubmit = () => {
    if (!isAuthenticated) {
      addSnackbar({message: "You are not authenticated!", type: "error"});
      return;
    }

    setLoading(true);

    const glide = {
      ...form,
      uid: user!.uid
    }

    alert(JSON.stringify(glide));
    setForm({content: ""});
    setLoading(false);
  }

  return {
    handleInput,
    handleSubmit,
    form,
    loading
  }
}

export default useMessenger;
