export function Toast({ mensagem }: { mensagem: string }) {
  if (!mensagem) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      {mensagem}
    </div>
  );
}
