"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import {
  IconAlertCircle,
  IconCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";

type FeedBackType = "success" | "error" | "warning" | "info";

interface FeedBackProps {
  type: FeedBackType;
  title: string;
  detail: string;
  confirmButtonText?: string;
  confirmButtonAction?: () => void;
  cancelButtonText?: string;
  cancelButtonAction?: () => void;
}

const iconMap = {
  success: (
    <IconCheck className="text-green-500 dark:text-green-400" size={80} />
  ),
  error: <IconX className="text-red-500 dark:text-red-400" size={80} />,
  warning: (
    <IconAlertCircle
      className="text-yellow-500 dark:text-yellow-400"
      size={80}
    />
  ),
  info: (
    <IconInfoCircle className="text-blue-500 dark:text-blue-400" size={80} />
  ),
};

const FeedBack: React.FC<FeedBackProps> = ({
  type,
  title,
  detail,
  confirmButtonText,
  confirmButtonAction,
  cancelButtonText,
  cancelButtonAction,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      <motion.div
        animate={{ scale: 1 }}
        className="mb-6"
        initial={{ scale: 0 }}
        transition={{ duration: 0.5 }}
      >
        {iconMap[type]}
      </motion.div>

      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h1>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.4 }}
      >
        {detail}
      </motion.p>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex space-x-4"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.6 }}
      >
        {cancelButtonText && (
          <Button
            size="sm"
            onClick={
              cancelButtonAction ? cancelButtonAction : () => router.back()
            }
          >
            {cancelButtonText}
          </Button>
        )}

        {confirmButtonText && (
          <Button color="primary" size="sm" onClick={confirmButtonAction}>
            {confirmButtonText}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default FeedBack;
