(function () {
    if (!globalThis.canvasEditor) globalThis.canvasEditor = {};
    const canvasEditor = globalThis.canvasEditor;

    function load(cont) {
        const scripts = cont.textContent.trim().split('\n');
        const base_path = `/file=${scripts.shift()}/js`;
        cont.textContent = '';

        const df = document.createDocumentFragment();
        for (let src of scripts) {
            const script = document.createElement('script');
            script.async = true;
            script.type = 'module';
            script.src = `file=${src}`;
            df.appendChild(script);
        }

        globalThis.canvasEditor.import = async () => {
            const polotno = await import(`${base_path}/polotno.bundle.js`);

            return {polotno};
        };

        if (!globalThis.canvasEditor.imports) {
            globalThis.canvasEditor.imports = {};
        }

        if (!globalThis.canvasEditor.imports.polotno) {
            globalThis.canvasEditor.imports.polotno = async () => await import(`${base_path}/polotno.bundle.js`);
        }

        cont.appendChild(df);


    }

    onUiLoaded(function () {
        canvasEditorImport = gradioApp().querySelector('#canvas-editor-import');
        if (canvasEditorImport) {
            load(canvasEditorImport);
        }

        // In A1111 the gallery components are not exposed on window; fall back to the DOM ids.
        createSendToCanvasEditorButton("image_buttons_txt2img", window.txt2img_gallery || gradioApp().querySelector('#txt2img_gallery'));
        createSendToCanvasEditorButton("image_buttons_img2img", window.img2img_gallery || gradioApp().querySelector('#img2img_gallery'));
        createSendToCanvasEditorButton("image_buttons_extras", window.extras_gallery || gradioApp().querySelector('#extras_gallery'));

        function createSendToCanvasEditorButton(queryId, gallery) {
            const existingButton = gradioApp().querySelector(`#${queryId} button`);
            if (!existingButton) {
                return;
            }
            const newButton = existingButton.cloneNode(true);
            newButton.style.display = "flex";
            newButton.id = `${queryId}_send_to_canvasEditor`;
            newButton.addEventListener("click", () => sendImageToCanvasEditor(gallery));
            newButton.title = "Send to Canvas Editor"
            newButton.textContent = "\u{2712}";

            existingButton.parentNode.appendChild(newButton);
        }
    });


})();