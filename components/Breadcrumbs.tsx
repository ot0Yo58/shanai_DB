import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="パンくずリスト">
      <div className="breadcrumbs__inner">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <span className="breadcrumbs__item" key={`${item.label}-${index}`}>
              {index > 0 ? (
                <span className="breadcrumbs__separator">{" > "}</span>
              ) : null}

              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}