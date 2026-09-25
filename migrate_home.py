import codecs

src_file = r'c:\xampp\htdocs\projects\quiroinnova_backend\quiroinnova-ui\src\App.jsx'
dest_file = r'c:\xampp\htdocs\projects\quiroinnova_backend\resources\js\Home.jsx'

with codecs.open(src_file, 'r', 'utf-8') as f:
    content = f.read()

content = content.replace('import React, { useState, useEffect, useRef } from "react";\r\n', '')
content = content.replace('import React, { useState, useEffect, useRef } from "react";\n', '')
content = content.replace('import React, { useState, useEffect, useRef } from "react";', '')

imports = """import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import Base from "./components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import { CarritoProvider } from "./context/CarritoContext";

"""

content = content.replace('export default function App() {', 'const Home = (properties) => {')

suffix = """

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <Home {...properties} />
            </Base>
        </CarritoProvider>,
    );
});
"""

final_content = imports + content + suffix

with codecs.open(dest_file, 'w', 'utf-8') as f:
    f.write(final_content)
