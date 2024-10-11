"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useFormState } from "react-dom";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { _teamSchema, teamSchema } from "@/src/schemas/team.schema";
import { FormControls, StepIndicator } from "@/components/ui/form-ui/form";
import { cn } from "@/lib/utils";
import { createTeam } from "@/src/actions/team.actions";
import AnimatedWrapper from "@/components/ui/animated-wrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FeedBack from "@/components/layout/notification/feed-back";
import { DescriptionTeamForm } from "@/components/workspaces/create_team/description-team-form";
import { InformationTeamForm } from "@/components/workspaces/create_team/informations-team-form";
import { AdministrationTeamForm } from "@/components/workspaces/create_team/adminitration-team-form";
import { ErrorDefaultCode } from "@/types";

const steps: string[] = [
  "Description",
  "Information sur l'organisation",
  "Informations sur le manager",
];

export default function CreatTeamContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [state, formAction] = useFormState(createTeam, {
    data: null,
    message: "",
    errors: {},
    status: "idle",
    code: undefined,
  });

  const {
    formState: { errors },
    trigger,
    control,
  } = useForm<_teamSchema>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: undefined,
      description: undefined,
      category: "",
      email: undefined,
      phone_number: undefined,
      address: undefined,
      city: undefined,
      country: undefined,
      manager_name: undefined,
      manager_email: undefined,
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    // Si le formulaire est validé aller sur la dernière section
    if (state.data && currentStep !== 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, state.data]);

  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidate(currentStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsToValidate = (step: number): (keyof _teamSchema)[] => {
    switch (step) {
      case 0:
        return ["name", "description", "category"];
      case 1:
        return ["email", "phone_number", "address", "city", "country"];
      case 2:
        return ["manager_name", "manager_email"];
      default:
        return [];
    }
  };

  return (
    <div className="p-4 lg:p-10 min-h-screen">
      <div className="w-full relative lg:grid lg:min-h-[calc(100vh-200px)] lg:grid-cols-2 gap-4 lg:gap-10">
        <div>
          {/* Navigation */}
          <StepIndicator currentStep={currentStep} steps={steps} />
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-full max-w-screen-sm gap-6">
              <AnimatedWrapper
                animation="fadeIn"
                className={state.message ? "block" : "hidden"}
                whileInView={state.message ? "visible" : "hidden"}
              >
                <Alert
                  variant={state.status === "error" ? "destructive" : "default"}
                >
                  {state.status === "error" ? (
                    <IconAlertTriangle className="h-4 w-4" />
                  ) : (
                    <IconCheck className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {state.status === "error" ? "Erreur" : "Succès"}
                  </AlertTitle>
                  <AlertDescription>
                    <p>{state.message}</p>
                    <p>
                      {state?.code == ErrorDefaultCode.exception &&
                        "Pensez à passer mettre à niveau votre plan"}
                    </p>
                  </AlertDescription>
                </Alert>
              </AnimatedWrapper>
              <div className="relative grid gap-2">
                <motion.h1
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(title({ size: "h4" }), "text-center")}
                  initial={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  Nouvelle organisation
                </motion.h1>
                <form
                  action={formAction}
                  className={cn(currentStep !== 3 ? "block" : "hidden", "mt-8")}
                >
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={currentStep}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      initial={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={cn(currentStep === 0 ? "block" : "hidden")}
                      >
                        <DescriptionTeamForm
                          control={control}
                          errors={errors}
                        />
                      </div>
                      <div
                        className={cn(currentStep === 1 ? "block" : "hidden")}
                      >
                        <InformationTeamForm
                          control={control}
                          errors={errors}
                        />
                      </div>
                      <div
                        className={cn(currentStep === 2 ? "block" : "hidden")}
                      >
                        <AdministrationTeamForm
                          control={control}
                          errors={errors}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      initial={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormControls
                        isSubmit={currentStep == 2}
                        onNext={nextStep}
                        onPrev={prevStep}
                      />
                    </motion.div>
                  </AnimatePresence>
                </form>
                <motion.div
                  className={cn(currentStep === 3 ? "block" : "hidden")}
                  initial={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  <FeedBack
                    cancelButtonAction={() => router.push("/")}
                    cancelButtonText="Je retourne à la page d'accueil"
                    confirmButtonAction={() => router.push(`/workspaces`)}
                    confirmButtonText="J'accède à mon espace de travail"
                    detail="Vous avez réussi la création d'organisation"
                    title="Bravo"
                    type="success"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden relative object-cover bg-muted h-full max-h-[500px] sm:block md:rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl overflow-hidden">
          <Image
            fill
            alt="Image"
            className="h-full w-full dark:brightness-[0.5]"
            src="/images/illustrations/team_in_app.jpg"
          />
        </div>
      </div>
    </div>
  );
}
