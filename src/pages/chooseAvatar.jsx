import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AvatarOnboardingModal from "../../components/AvatarOnboardingModal";
import SeoMeta from "../../components/SeoMeta";

const getAvatarSkipKey = (email) => `avatar_onboarding_skipped_${email || "unknown"}`;

const ChooseAvatarPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentAvatar = localStorage.getItem("user_avatar") || "";
    const storedEmail = localStorage.getItem("useremail") || "";
    const wasSkipped = localStorage.getItem(getAvatarSkipKey(storedEmail)) === "1";
    if (currentAvatar || wasSkipped) {
      navigate("/regrets", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#090b12] to-slate-950 px-4 py-8 text-white sm:py-10">
      <SeoMeta
        title="Choose Avatar"
        description="Choose your avatar for Regrets.in profile."
        path="/choose-avatar"
        noIndex
      />
      <div className="mx-auto flex w-full max-w-3xl justify-center">
        <AvatarOnboardingModal
          isOpen
          inline
          showSkip
          secondaryLabel="Skip"
          title="Choose your avatar"
          subtitle="Pick one avatar to continue. You can change it later in profile."
          saveLabel="Save Avatar"
          onSaved={(avatarValue) => {
            const storedEmail = localStorage.getItem("useremail");
            if (storedEmail) {
              localStorage.removeItem(getAvatarSkipKey(storedEmail));
            }
            localStorage.setItem("user_avatar", avatarValue);
            navigate("/regrets", { replace: true });
          }}
          onSkip={() => {
            const storedEmail = localStorage.getItem("useremail");
            localStorage.setItem(getAvatarSkipKey(storedEmail), "1");
            navigate("/regrets", { replace: true });
          }}
        />
      </div>
    </div>
  );
};

export default ChooseAvatarPage;
