export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-[fade-in_500ms_ease-out_both]">{children}</div>;
}
