```patch
*** Begin Patch
*** Update File: globals.css
@@
-/* From Uiverse.io by PriyanshuGupta28 */
-.checkbox-wrapper input[type="checkbox"] {
-  visibility: hidden;
-  display: none;
-}
+/* From Uiverse.io by PriyanshuGupta28 */
+.checkbox-wrapper input[type="checkbox"] {
+  visibility: hidden;
+  display: none;
+}
@@
-.checkbox-wrapper .path1 {
-  stroke-dasharray: 400;
-  stroke-dashoffset: 400;
-  transition: .5s stroke-dashoffset;
-  opacity: 0;
-}
+.checkbox-wrapper .path1 {
+  stroke-dasharray: 400;
+  stroke-dashoffset: 400;
+  transition: .5s stroke-dashoffset;
+  opacity: 0;
+}
@@
-.checkbox-wrapper .check:checked + label svg g path {
-  stroke-dashoffset: 0;
-  opacity: 1;
-}
+.checkbox-wrapper .check:checked + label svg g path {
+  stroke-dashoffset: 0;
+  opacity: 1;
+}
*** End Patch

*** Begin Patch
*** Update File: app/page.js
@@
-        <div className="my-5">
-          <label className="block font-bold mb-2">
-            Roles (select at least one)
-          </label>
-          <div className="flex flex-wrap -mx-2">
-            <div className="px-2 w-1/2">
-              <label className="inline-flex items-center">
-                <input
-                  type="checkbox"
-                  name="roles"
-                  value="Music Artist / Musician"
-                  checked={formData.roles.includes('Music Artist / Musician')}
-                  onChange={handleCheckboxChange}
-                  className="form-checkbox"
-                />
-                <span className="ml-2">Music Artist / Musician</span>
-              </label>
-            </div>
-            {/* … other original checkboxes … */}
-          </div>
-          {formData.roles.includes('Other') && (
-            <div className="mt-4">
-              <label htmlFor="otherRole" className="block font-bold mb-2">
-                Please specify:
-              </label>
-              <input
-                type="text"
-                id="otherRole"
-                name="otherRole"
-                value={formData.otherRole}
-                onChange={handleChange}
-                className="w-full"
-                required
-              />
-            </div>
-          )}
-        </div>
+        <div className="my-5">
+          <label className="block font-bold mb-2">
+            Roles (select at least one)
+          </label>
+          <div className="flex flex-wrap gap-4">
+            {/* Music Artist / Musician */}
+            <div className="checkbox-wrapper inline-flex items-center">
+              <input
+                type="checkbox"
+                id="role-music-artist"
+                className="check"
+                name="roles"
+                value="Music Artist / Musician"
+                checked={formData.roles.includes('Music Artist / Musician')}
+                onChange={handleCheckboxChange}
+              />
+              <label htmlFor="role-music-artist" className="label inline-flex items-center">
+                <svg width="45" height="45" viewBox="0 0 95 95">
+                  <rect x="30" y="20" width="50" height="50" stroke="white" fill="none" />
+                  <g transform="translate(0,-952.36222)">
+                    <path
+                      d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
+                      stroke="white"
+                      strokeWidth="3"
+                      fill="none"
+                      className="path1"
+                    />
+                  </g>
+                </svg>
+                <span className="ml-2">Music Artist / Musician</span>
+              </label>
+            </div>
+            {/* Repeat the above Uiverse-styled structure for the rest of your roles */}
+          </div>
+          {formData.roles.includes('Other') && (
+            <div className="mt-4">
+              <label htmlFor="otherRole" className="block font-bold mb-2">
+                Please specify:
+              </label>
+              <input
+                type="text"
+                id="otherRole"
+                name="otherRole"
+                value={formData.otherRole}
+                onChange={handleChange}
+                className="w-full"
+                required
+              />
+            </div>
+          )}
+        </div>
*** End Patch
```
