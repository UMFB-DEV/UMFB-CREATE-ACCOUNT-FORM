export default function IframeDemo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          WordPress Iframe Demo
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Responsive Iframe Embed
          </h2>
          <p className="text-gray-600 mb-6">
            This demonstrates how the form will appear when embedded in WordPress via iframe.
            The iframe is fully responsive and will adapt to different screen sizes.
          </p>

          <div className="border-2 border-gray-200 rounded-lg p-4">
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '0',
                paddingBottom: '75%',
                overflow: 'hidden'
              }}
            >
              <iframe
                src="/"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                title="Account Opening Form"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-900">
            WordPress Integration Code
          </h3>
          <p className="text-blue-800 mb-4">
            Use this code in your WordPress page or post editor:
          </p>
          <pre className="bg-blue-100 p-4 rounded text-sm overflow-x-auto">
{`<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%; overflow: hidden;">
  <iframe
    src="https://your-domain.vercel.app"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    title="Account Opening Form">
  </iframe>
</div>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

