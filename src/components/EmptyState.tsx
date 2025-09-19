import Image from "next/image";

interface EmptyStateProps {
  text: string,
  subText?: string
}

export const EmptyState = ({text, subText}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Image src="/imgs/EmptyState.svg" alt="Empty State" width={200} height={200} className="pb-4" />
      <h2 className="text-xl font-semibold text-gray-700">{text}</h2>
      <p className="text-gray-500 text-center max-w-md">
        {subText}
      </p>
    </div>
  );
};
