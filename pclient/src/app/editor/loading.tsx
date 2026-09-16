// Shows a lightweight Vercel-style transition while editor routes load.
export default function EditorLoading() {
  return (
    <main className="editor-route-loading" aria-label="Loading editor workspace">
      <div className="vercel-loader" aria-hidden="true"><span /><span /><span /></div>
      <p>Loading workspace</p>
    </main>
  );
}
