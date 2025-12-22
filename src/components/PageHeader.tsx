interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="section-container">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-balance">{title}</h1>
        {description && (
          <p className="mt-3 text-body-lg text-primary-foreground/80 max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
