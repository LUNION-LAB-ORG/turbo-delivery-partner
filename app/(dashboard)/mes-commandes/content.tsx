"use client";

import { useState, useEffect } from "react";
import { title } from "@/components/primitives";
import { InWorking } from '@/components/commons/InWorking';

export default function Content() {

    return (
        <div className="w-full h-full flex flex-1 flex-col gap-4 lg:gap-6 mb-10">
            <InWorking
                titre="Notre Nouvelle Fonctionnalité Arrive Bientôt"
                message="Notre équipe travaille actuellement sur cette page pour vous offrir une meilleure expérience"
                datePrevue="1er Novembre 2025"
                showDate={true}
            />
        </div>
    );
}