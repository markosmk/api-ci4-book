export function HeadingMain({
  children,
  title,
  description
}: {
  children?: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="mt-6 flex items-start justify-between">
      <div className="flex w-full flex-col">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 md:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground md:text-lg">
          {description}
        </p>
      </div>
      {children && (
        <div className="mt-2 flex items-center justify-center space-x-2">
          {children}
        </div>
      )}
    </div>
  );
}
