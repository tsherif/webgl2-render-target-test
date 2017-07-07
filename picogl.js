/*
PicoGL.js v0.3.6 

The MIT License (MIT)

Copyright (c) 2017 Tarek Sherif

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function() {
    "use strict";

    /**
        Global PicoGL module. For convenience, all WebGL enums are stored
        as properties of PicoGL (e.g. PicoGL.FLOAT, PicoGL.ONE_MINUS_SRC_ALPHA).
        
        @namespace PicoGL
        @prop {string} version Current PicoGL version.
        @prop {object} TEXTURE_INTERNAL_FORMAT Map of framebuffer texture formats to internal formats.
        @prop {object} TYPE_SIZE Map of data types to sizes in bytes.
        @prop {object} WEBGL_INFO WebGL context information.
    */
    var PicoGL = window.PicoGL = {
        version: "0.3.6"
    };

    (function() {
        // Absorb all GL enums for convenience
        var canvas = document.createElement("canvas");
        var gl = canvas.getContext("webgl2");
        
        if (!gl) {
            return;
        }

        for (var enumName in gl) {
            if (enumName.match(/^[A-Z0-9_x]+$/) && typeof(gl[enumName]) === "number") {
                PicoGL[enumName] = gl[enumName];
            }
        }

        PicoGL.TEXTURE_INTERNAL_FORMAT = {};
        var UNSIGNED_BYTE = PicoGL.TEXTURE_INTERNAL_FORMAT[gl.UNSIGNED_BYTE] = {};
        UNSIGNED_BYTE[gl.RED] = gl.R8;
        UNSIGNED_BYTE[gl.RG] = gl.RG8;
        UNSIGNED_BYTE[gl.RGB] = gl.RGB8;
        UNSIGNED_BYTE[gl.RGBA] = gl.RGBA8;

        var UNSIGNED_SHORT = PicoGL.TEXTURE_INTERNAL_FORMAT[gl.UNSIGNED_SHORT] = {};
        UNSIGNED_SHORT[gl.DEPTH_COMPONENT] = gl.DEPTH_COMPONENT16;

        var FLOAT = PicoGL.TEXTURE_INTERNAL_FORMAT[gl.FLOAT] = {};
        FLOAT[gl.RED] = gl.R16F;
        FLOAT[gl.RG] = gl.RG16F;
        FLOAT[gl.RGB] = gl.RGB16F;
        FLOAT[gl.RGBA] = gl.RGBA16F;
        FLOAT[gl.DEPTH_COMPONENT] = gl.DEPTH_COMPONENT32F;

        PicoGL.TYPE_SIZE = {};
        PicoGL.TYPE_SIZE[gl.BYTE]              = 1;
        PicoGL.TYPE_SIZE[gl.UNSIGNED_BYTE]     = 1;
        PicoGL.TYPE_SIZE[gl.SHORT]             = 2;
        PicoGL.TYPE_SIZE[gl.UNSIGNED_SHORT]    = 2;
        PicoGL.TYPE_SIZE[gl.INT]               = 4;
        PicoGL.TYPE_SIZE[gl.UNSIGNED_INT]      = 4;
        PicoGL.TYPE_SIZE[gl.FLOAT]             = 4;

        PicoGL.UNIFORM_FUNC_NAME = {};
        PicoGL.UNIFORM_FUNC_NAME[gl.BOOL] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.INT] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.SAMPLER_2D] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.INT_SAMPLER_2D] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.UNSIGNED_INT_SAMPLER_2D] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.SAMPLER_2D_SHADOW] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.SAMPLER_2D_ARRAY] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.INT_SAMPLER_2D_ARRAY] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.UNSIGNED_INT_SAMPLER_2D_ARRAY] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.SAMPLER_2D_ARRAY_SHADOW] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.SAMPLER_CUBE] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.INT_SAMPLER_CUBE] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.UNSIGNED_INT_SAMPLER_CUBE] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.SAMPLER_CUBE_SHADOW] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.SAMPLER_3D] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.INT_SAMPLER_3D] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.UNSIGNED_INT_SAMPLER_3D] = "uniform1i";
        PicoGL.UNIFORM_FUNC_NAME[gl.UNSIGNED_INT] = "uniform1ui";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT] = "uniform1f";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_VEC2] = "uniform2f";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_VEC3] = "uniform3f";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_VEC4] = "uniform4f";
        PicoGL.UNIFORM_FUNC_NAME[gl.INT_VEC2] = "uniform2i";
        PicoGL.UNIFORM_FUNC_NAME[gl.INT_VEC3] = "uniform3i";
        PicoGL.UNIFORM_FUNC_NAME[gl.INT_VEC4] = "uniform4i";
        PicoGL.UNIFORM_FUNC_NAME[gl.UNSIGNED_INT_VEC2] = "uniform2ui";
        PicoGL.UNIFORM_FUNC_NAME[gl.UNSIGNED_INT_VEC3] = "uniform3ui";
        PicoGL.UNIFORM_FUNC_NAME[gl.UNSIGNED_INT_VEC4] = "uniform4ui";
        PicoGL.UNIFORM_FUNC_NAME[gl.BOOL_VEC2] = "uniform2i";
        PicoGL.UNIFORM_FUNC_NAME[gl.BOOL_VEC3] = "uniform3i";
        PicoGL.UNIFORM_FUNC_NAME[gl.BOOL_VEC4] = "uniform4i";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_MAT2] = "uniformMatrix2fv";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_MAT3] = "uniformMatrix3fv";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_MAT4] = "uniformMatrix4fv";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_MAT2x3] = "uniformMatrix2x3fv";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_MAT2x4] = "uniformMatrix2x4fv";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_MAT3x2] = "uniformMatrix3x2fv";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_MAT3x4] = "uniformMatrix3x4fv";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_MAT4x2] = "uniformMatrix4x2fv";
        PicoGL.UNIFORM_FUNC_NAME[gl.FLOAT_MAT4x3] = "uniformMatrix4x3fv";

        PicoGL.UNIFORM_COMPONENT_COUNT = {};
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.BOOL] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.INT] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.SAMPLER_2D] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.INT_SAMPLER_2D] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.UNSIGNED_INT_SAMPLER_2D] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.SAMPLER_2D_SHADOW] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.SAMPLER_2D_ARRAY] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.INT_SAMPLER_2D_ARRAY] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.UNSIGNED_INT_SAMPLER_2D_ARRAY] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.SAMPLER_2D_ARRAY_SHADOW] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.SAMPLER_CUBE] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.INT_SAMPLER_CUBE] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.UNSIGNED_INT_SAMPLER_CUBE] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.SAMPLER_CUBE_SHADOW] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.SAMPLER_3D] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.INT_SAMPLER_3D] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.UNSIGNED_INT_SAMPLER_3D] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.UNSIGNED_INT] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT] = 1;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_VEC2] = 2;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_VEC3] = 3;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_VEC4] = 4;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.INT_VEC2] = 2;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.INT_VEC3] = 3;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.INT_VEC4] = 4;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.UNSIGNED_INT_VEC2] = 2;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.UNSIGNED_INT_VEC3] = 3;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.UNSIGNED_INT_VEC4] = 4;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.BOOL_VEC2] = 2;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.BOOL_VEC3] = 3;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.BOOL_VEC4] = 4;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_MAT2] = 4;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_MAT3] = 9;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_MAT4] = 16;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_MAT2x3] = 6;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_MAT2x4] = 8;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_MAT3x2] = 6;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_MAT3x4] = 12;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_MAT4x2] = 8;
        PicoGL.UNIFORM_COMPONENT_COUNT[gl.FLOAT_MAT4x3] = 12;

        PicoGL.UNIFORM_CACHE_CLASS = {};
        PicoGL.UNIFORM_CACHE_CLASS[gl.INT] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.SAMPLER_2D] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.INT_SAMPLER_2D] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.UNSIGNED_INT_SAMPLER_2D] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.SAMPLER_2D_SHADOW] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.SAMPLER_2D_ARRAY] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.INT_SAMPLER_2D_ARRAY] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.UNSIGNED_INT_SAMPLER_2D_ARRAY] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.SAMPLER_2D_ARRAY_SHADOW] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.SAMPLER_CUBE] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.INT_SAMPLER_CUBE] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.UNSIGNED_INT_SAMPLER_CUBE] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.SAMPLER_CUBE_SHADOW] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.SAMPLER_3D] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.INT_SAMPLER_3D] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.UNSIGNED_INT_SAMPLER_3D] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.UNSIGNED_INT] = Uint32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.FLOAT] = Float32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.FLOAT_VEC2] = Float32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.FLOAT_VEC3] = Float32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.FLOAT_VEC4] = Float32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.INT_VEC2] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.INT_VEC3] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.INT_VEC4] = Int32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.UNSIGNED_INT_VEC2] = Uint32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.UNSIGNED_INT_VEC3] = Uint32Array;
        PicoGL.UNIFORM_CACHE_CLASS[gl.UNSIGNED_INT_VEC4] = Uint32Array;

        PicoGL.WEBGL_INFO = {};
        PicoGL.WEBGL_INFO.MAX_TEXTURE_UNITS = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        PicoGL.WEBGL_INFO.MAX_UNIFORM_BUFFERS = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS);

    })();



    PicoGL.DUMMY_OBJECT = {};

    /**
        Create a PicoGL app. The app is the primary entry point to PicoGL. It stores
        the canvas, the WebGL context and all WebGL state.

        @function PicoGL.createApp
        @param {DOMElement} canvas The canvas on which to create the WebGL context.
        @param {Object} [contextAttributes] Context attributes to pass when calling getContext().
    */
    PicoGL.createApp = function(canvas, contextAttributes) {
        return new PicoGL.App(canvas, contextAttributes);
    };

})();

;(function() {
    "use strict";

    /**
        Primary entry point to PicoGL. An app will store all parts of the WebGL
        state and manage draw calls.

        @class
        @prop {DOMElement} canvas The canvas on which this app drawing.
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {number} width The width of the drawing surface.
        @prop {number} height The height of the drawing surface.
        @prop {boolean} floatRenderTargetsEnabled Whether the EXT_color_buffer_float extension is enabled.
        @prop {boolean} linearFloatTexturesEnabled Whether the OES_texture_float_linear extension is enabled.
        @prop {Object} state Tracked GL state.
        @prop {GLEnum} clearBits Current clear mask to use with clear().
        @prop {Timer} timer Rendering timer.
        @prop {number} cpuTime Time spent on CPU during last timing. Only valid if timerReady() returns true.
        @prop {number} gpuTime Time spent on GPU during last timing. Only valid if timerReady() returns true.
                Will remain 0 if extension EXT_disjoint_timer_query_webgl2 is unavailable.
    */
    PicoGL.App = function App(canvas, contextAttributes) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2", contextAttributes);
        this.width = this.gl.drawingBufferWidth;
        this.height = this.gl.drawingBufferHeight;
        this.viewportWidth = this.width;
        this.viewportHeight = this.height;
        this.currentDrawCalls = null;
        this.emptyFragmentShader = null;

        this.state = {
            program: null,
            vertexArray: null,
            transformFeedback: null,
            activeTexture: -1,
            textures: new Array(PicoGL.WEBGL_INFO.MAX_TEXTURE_UNITS),
            textureCount: 0,
            freeTextureUnits: [],
            // TODO(Tarek): UBO state currently not tracked, due bug
            // with UBO state becoming corrupted between frames in Chrome
            // https://bugs.chromium.org/p/chromium/issues/detail?id=722060
            // Enable UBO state tracking when that's fixed.
            uniformBuffers: new Array(PicoGL.WEBGL_INFO.MAX_UNIFORM_BUFFERS),
            uniformBufferCount: 0,
            freeUniformBufferBases: [],
            drawFramebuffer: null,
            readFramebuffer: null,
        };

        this.clearBits = this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT| this.gl.STENCIL_BUFFER_BIT;
        
        this.timer = new PicoGL.Timer(this.gl);
        this.cpuTime = 0;
        this.gpuTime = 0;

        this.floatRenderTargetsEnabled = false;
        this.linearFloatTexturesEnabled = false;
        
        this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
    };

    /**
        Set the color mask to selectively enable or disable particular
        color channels while rendering.

        @method
        @param {boolean} r Red channel.
        @param {boolean} g Green channel.
        @param {boolean} b Blue channel.
        @param {boolean} a Alpha channel.
    */
    PicoGL.App.prototype.colorMask = function(r, g, b, a) {
        this.gl.colorMask(r, g, b, a);

        return this;
    };

    /**
        Set the clear color.

        @method
        @param {number} r Red channel.
        @param {number} g Green channel.
        @param {number} b Blue channel.
        @param {number} a Alpha channel.
    */
    PicoGL.App.prototype.clearColor = function(r, g, b, a) {
        this.gl.clearColor(r, g, b, a);

        return this;
    };

    /**
        Set the clear mask bits to use when calling clear().
        E.g. app.clearMask(PicoGL.COLOR_BUFFER_BIT).

        @method
        @param {GLEnum} mask Bit mask of buffers to clear.
    */
    PicoGL.App.prototype.clearMask = function(mask) {
        this.clearBits = mask;

        return this;
    };

    /**
        Clear the canvas

        @method
    */
    PicoGL.App.prototype.clear = function() {
        this.gl.clear(this.clearBits);

        return this;
    };

    /**
        Set the list of DrawCalls to use when calling draw().

        @method
        @param {Array} drawCallList Array of DrawCall objects.
        @see DrawCall
    */
    PicoGL.App.prototype.drawCalls = function(drawCallList) {
        this.currentDrawCalls = drawCallList;

        return this;
    };

    /**
        Bind a draw framebuffer to the WebGL context.

        @method
        @param {Framebuffer} framebuffer The Framebuffer object to bind.
        @see Framebuffer
    */
    PicoGL.App.prototype.drawFramebuffer = function(framebuffer) {
        framebuffer.bindForDraw();

        if (this.viewportWidth !== framebuffer.width || this.viewportHeight !== framebuffer.height) {
            this.viewportWidth = framebuffer.width;
            this.viewportHeight = framebuffer.height;
            this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        }      

        return this;
    };

    /**
        Bind a read framebuffer to the WebGL context.

        @method
        @param {Framebuffer} framebuffer The Framebuffer object to bind.
        @see Framebuffer
    */
    PicoGL.App.prototype.readFramebuffer = function(framebuffer) {
        framebuffer.bindForRead();

        return this;
    };

    /**
        Switch back to the default framebuffer for drawing (i.e. draw to the screen).

        @method
    */
    PicoGL.App.prototype.defaultDrawFramebuffer = function() {
        if (this.state.drawFramebuffer !== null) {
            this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, null);
            this.state.drawFramebuffer = null;
            
            if (this.viewportWidth !== this.width || this.viewportHeight !== this.height) {
                this.viewportWidth = this.width;
                this.viewportHeight = this.height;
                this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
            } 
        }
    
        return this;
    };

    /**
        Switch back to the default framebuffer for reading (i.e. read from the screen).

        @method
    */
    PicoGL.App.prototype.defaultReadFramebuffer = function() {
        if (this.state.readFramebuffer !== null) {
            this.gl.bindFramebuffer(this.gl.READ_FRAMEBUFFER, null);
            this.state.readFramebuffer = null;
        }

        return this;
    };

    /**
        Set the depth range.

        @method
        @param {number} near Minimum depth value. 
        @param {number} far Maximum depth value.
    */
    PicoGL.App.prototype.depthRange = function(near, far) {
        this.gl.depthRange(near, far);

        return this;
    };

    /**
        Enable depth testing.

        @method
    */
    PicoGL.App.prototype.depthTest = function() {
        this.gl.enable(this.gl.DEPTH_TEST);

        return this;
    };

    /**
        Disable depth testing.

        @method
    */
    PicoGL.App.prototype.noDepthTest = function() {
        this.gl.disable(this.gl.DEPTH_TEST);

        return this;
    };

    /**
        Enable writing to the z buffer.

        @method
    */
    PicoGL.App.prototype.depthMask = function() {
        this.gl.depthMask(true);

        return this;
    };

    /**
        Disable writing to the z buffer.

        @method
    */
    PicoGL.App.prototype.noDepthMask = function() {
        this.gl.depthMask(false);

        return this;
    };

    /**
        Set the depth test function. E.g. app.depthFunc(PicoGL.LEQUAL).

        @method
        @param {GLEnum} func The depth testing function to use.
    */
    PicoGL.App.prototype.depthFunc = function(func) {
        this.gl.depthFunc(func);

        return this;
    };

    /**
        Enable blending.

        @method
    */
    PicoGL.App.prototype.blend = function() {
        this.gl.enable(this.gl.BLEND);

        return this;
    };

    /**
        Disable blending

        @method
    */
    PicoGL.App.prototype.noBlend = function() {
        this.gl.disable(this.gl.BLEND);

        return this;
    };

    /**
        Set the blend function. E.g. app.blendFunc(PicoGL.ONE, PicoGL.ONE_MINUS_SRC_ALPHA).

        @method
        @param {GLEnum} src The source blending weight.
        @param {GLEnum} dest The destination blending weight.
    */
    PicoGL.App.prototype.blendFunc = function(src, dest) {
        this.gl.blendFunc(src, dest);

        return this;
    };

    /**
        Set the blend function, with separate weighting for color and alpha channels. 
        E.g. app.blendFuncSeparate(PicoGL.ONE, PicoGL.ONE_MINUS_SRC_ALPHA, PicoGL.ONE, PicoGL.ONE).

        @method
        @param {GLEnum} csrc The source blending weight for the RGB channels.
        @param {GLEnum} cdest The destination blending weight for the RGB channels.
        @param {GLEnum} asrc The source blending weight for the alpha channel.
        @param {GLEnum} adest The destination blending weight for the alpha channel.
    */
    PicoGL.App.prototype.blendFuncSeparate = function(csrc, cdest, asrc, adest) {
        this.gl.blendFuncSeparate(csrc, cdest, asrc, adest);

        return this;
    };

    /**
        Enable stencil testing.
        NOTE: Only works if { stencil: true } passed as a 
        context attribute when creating the App!

        @method
    */
    PicoGL.App.prototype.stencilTest = function() {
        this.gl.enable(this.gl.STENCIL_TEST);

        return this;
    };

    /**
        Disable stencil testing.

        @method
    */
    PicoGL.App.prototype.noStencilTest = function() {
        this.gl.disable(this.gl.STENCIL_TEST);

        return this;
    };

    /**
        Set the bitmask to use for tested stencil values.
        E.g. app.stencilMask(0xFF).
        NOTE: Only works if { stencil: true } passed as a 
        context attribute when creating the App!
        
        @method
        @param {number} mask The mask value. 

    */
    PicoGL.App.prototype.stencilMask = function(mask) {
        this.gl.stencilMask(mask);

        return this;
    };

    /**
        Set the bitmask to use for tested stencil values for a particular face orientation. 
        E.g. app.stencilMaskSeparate(PicoGL.FRONT, 0xFF).
        NOTE: Only works if { stencil: true } passed as a 
        context attribute when creating the App!

        @method
        @param {GLEnum} face The face orientation to apply the mask to.
        @param {number} mask The mask value.

    */
    PicoGL.App.prototype.stencilMaskSeparate = function(face, mask) {
        this.gl.stencilMaskSeparate(face, mask);

        return this;
    };

    /**
        Set the stencil function and reference value. 
        E.g. app.stencilFunc(PicoGL.EQUAL, 1, 0xFF).
        NOTE: Only works if { stencil: true } passed as a 
        context attribute when creating the App!

        @method
        @param {GLEnum} func The testing function.
        @param {number} ref The reference value.
        @param {GLEnum} mask The bitmask to use against tested values before applying
            the stencil function.
    */
    PicoGL.App.prototype.stencilFunc = function(func, ref, mask) {
        this.gl.stencilFunc(func, ref, mask);

        return this;
    };

    /**
        Set the stencil function and reference value for a particular face orientation. 
        E.g. app.stencilFuncSeparate(PicoGL.FRONT, PicoGL.EQUAL, 1, 0xFF).
        NOTE: Only works if { stencil: true } passed as a 
        context attribute when creating the App!

        @method
        @param {GLEnum} face The face orientation to apply the function to.
        @param {GLEnum} func The testing function.
        @param {number} ref The reference value.
        @param {GLEnum} mask The bitmask to use against tested values before applying
            the stencil function.
    */
    PicoGL.App.prototype.stencilFuncSeparate = function(face, func, ref, mask) {
        this.gl.stencilFuncSeparate(face, func, ref, mask);

        return this;
    };

    /**
        Set the operations for updating stencil buffer values. 
        E.g. app.stencilOp(PicoGL.KEEP, PicoGL.KEEP, PicoGL.REPLACE).
        NOTE: Only works if { stencil: true } passed as a 
        context attribute when creating the App!

        @method
        @param {GLEnum} stencilFail Operation to apply if the stencil test fails.
        @param {GLEnum} depthFail Operation to apply if the depth test fails.
        @param {GLEnum} pass Operation to apply if the both the depth and stencil tests pass.
    */
    PicoGL.App.prototype.stencilOp = function(stencilFail, depthFail, pass) {
        this.gl.stencilOp(stencilFail, depthFail, pass);

        return this;
    };

    /**
        Set the operations for updating stencil buffer values for a particular face orientation. 
        E.g. app.stencilOpSeparate(PicoGL.FRONT, PicoGL.KEEP, PicoGL.KEEP, PicoGL.REPLACE).
        NOTE: Only works if { stencil: true } passed as a 
        context attribute when creating the App!

        @method
        @param {GLEnum} face The face orientation to apply the operations to.
        @param {GLEnum} stencilFail Operation to apply if the stencil test fails.
        @param {GLEnum} depthFail Operation to apply if the depth test fails.
        @param {GLEnum} pass Operation to apply if the both the depth and stencil tests pass.
    */
    PicoGL.App.prototype.stencilOpSeparate = function(face, stencilFail, depthFail, pass) {
        this.gl.stencilOpSeparate(face, stencilFail, depthFail, pass);

        return this;
    };

    /**
        Enable rasterization step.

        @method
    */
    PicoGL.App.prototype.rasterize = function() {
        this.gl.disable(this.gl.RASTERIZER_DISCARD);

        return this;
    };

    /**
        Disable rasterization step.

        @method
    */
    PicoGL.App.prototype.noRasterize = function() {
        this.gl.enable(this.gl.RASTERIZER_DISCARD);

        return this;
    };

    /**
        Enable backface culling.

        @method
    */
    PicoGL.App.prototype.cullBackfaces = function() {
        this.gl.enable(this.gl.CULL_FACE);

        return this;
    };

    /**
        Disable backface culling.

        @method
    */
    PicoGL.App.prototype.drawBackfaces = function() {
        this.gl.disable(this.gl.CULL_FACE);

        return this;
    };

    /**
        Enable the EXT_color_buffer_float extension. Allows for creating float textures as
        render targets on FrameBuffer objects. E.g. app.createFramebuffer().colorTarget(0, PicoGL.FLOAT).

        @method
        @see Framebuffer
    */
    PicoGL.App.prototype.floatRenderTargets = function() {
        this.floatRenderTargetsEnabled = !!this.gl.getExtension("EXT_color_buffer_float");
        
        if (!this.floatRenderTargetsEnabled) {
            console.warn("Extension EXT_color_buffer_float unavailable. Cannot enable float textures.");
        }
        
        return this;
    };

    /**
        Enable the OES_texture_float_linear extension. Allows for linear blending on float textures.

        @method
        @see Framebuffer
    */
    PicoGL.App.prototype.linearFloatTextures = function() {
        this.linearFloatTexturesEnabled = !!this.gl.getExtension("OES_texture_float_linear");
        
        if (!this.linearFloatTexturesEnabled) {
            console.warn("Extension OES_texture_float_linear unavailable. Cannot enable float texture linear filtering.");
        }
        
        return this;
    };

    /**
        Read a pixel's color value from the canvas. Note that the RGBA values will be encoded 
        as 0-255.

        @method
        @param {number} x The x coordinate of the pixel.
        @param {number} y The y coordinate of the pixel.
        @param {Uint8Array} outColor 4-element Uint8Array to store the pixel's color.
    */
    PicoGL.App.prototype.readPixel = function(x, y, outColor) {
        this.gl.readPixels(x, y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, outColor);

        return this;
    };

    /**
        Resize the drawing surface.

        @method
        @param {number} width The new canvas width.
        @param {number} height The new canvas height.
    */
    PicoGL.App.prototype.resize = function(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.width = this.gl.drawingBufferWidth;
        this.height = this.gl.drawingBufferHeight;
        this.viewportWidth = this.width;
        this.viewportHeight = this.height;
        this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        
        return this;
    };
    /**
        Create a program.

        @method
        @param {Shader|string} vertexShader Vertex shader object or source code.
        @param {Shader|string} fragmentShader Fragment shader object or source code.
        @param {Array} [xformFeedbackVars] Transform feedback varyings.
    */
    PicoGL.App.prototype.createProgram = function(vsSource, fsSource, xformFeedbackVars) {
        return new PicoGL.Program(this.gl, vsSource, fsSource, xformFeedbackVars);
    };

    /**
        Create a shader. Creating a shader separately from a program allows for 
        shader reuse.

        @method
        @param {GLEnum} type Shader type.
        @param {string} source Shader source.
    */
    PicoGL.App.prototype.createShader = function(type, source) {
        return new PicoGL.Shader(this.gl, type, source);
    };

    /**
        Create a vertex array.

        @method
    */
    PicoGL.App.prototype.createVertexArray = function() {
        return new PicoGL.VertexArray(this.gl);
    };

    /**
        Create a transform feedback object.

        @method
    */
    PicoGL.App.prototype.createTransformFeedback = function() {
        return new PicoGL.TransformFeedback(this.gl);
    };

    /**
        Create a vertex buffer.

        @method
        @param {GLEnum} type The data type stored in the vertex buffer.
        @param {number} itemSize Number of elements per vertex.
        @param {ArrayBufferView} data Buffer data.
        @param {GLEnum} [usage=STATIC_DRAW] Buffer usage.
    */
    PicoGL.App.prototype.createVertexBuffer = function(type, itemSize, data, usage) {
        return new PicoGL.VertexBuffer(this.gl, type, itemSize, data, usage);
    };

    /**
        Create a per-vertex matrix buffer. Matrix buffers ensure that columns
        are correctly split across attribute locations.

        @method
        @param {GLEnum} type The data type stored in the matrix buffer. Valid types
        are FLOAT_MAT4, FLOAT_MAT4x2, FLOAT_MAT4x3, FLOAT_MAT3, FLOAT_MAT3x2, 
        FLOAT_MAT3x4, FLOAT_MAT2, FLOAT_MAT2x3, FLOAT_MAT2x4.
        @param {ArrayBufferView} data Matrix buffer data.
        @param {GLEnum} [usage=STATIC_DRAW] Buffer usage.
    */
    PicoGL.App.prototype.createMatrixBuffer = function(type, data, usage) {
        return new PicoGL.VertexBuffer(this.gl, type, null, data, usage);
    };

    /**
        Create an index buffer.

        @method
        @param {GLEnum} type The data type stored in the index buffer.
        @param {number} itemSize Number of elements per primitive.
        @param {ArrayBufferView} data Index buffer data.
    */
    PicoGL.App.prototype.createIndexBuffer = function(type, itemSize, data) {
        return new PicoGL.VertexBuffer(this.gl, type, itemSize, data, null, true);
    };

    /**
        Create a uniform buffer in std140 layout. NOTE: FLOAT_MAT2, FLOAT_MAT3x2, FLOAT_MAT4x2, 
        FLOAT_MAT3, FLOAT_MAT2x3, FLOAT_MAT4x3 are supported, but must be manually padded to
        4-float column alignment by the application!

        @method
        @param {Array} layout Array indicating the order and types of items to 
                        be stored in the buffer.
        @param {GLEnum} [usage=DYNAMIC_DRAW] Buffer usage.
    */
    PicoGL.App.prototype.createUniformBuffer = function(layout, usage) {
        return new PicoGL.UniformBuffer(this.gl, layout, usage);
    };

    /**
        Create a 2D texture.

        @method
        @param {DOMElement|ArrayBufferView} image Image data. Can be any format that would be accepted 
                by texImage2D. 
        @param {number} [width] Texture width. Required for array data.
        @param {number} [height] Texture height. Required for array data.
        @param {Object} [options] Texture options.
        @param {GLEnum} [options.type=UNSIGNED_BYTE] Type of data stored in the texture.
        @param {GLEnum} [options.format=RGBA] Texture data format.
        @param {GLEnum} [options.internalFormat=RGBA] Texture data internal format.
        @param {boolean} [options.flipY=false] Whether the y-axis be flipped when unpacking the texture.
        @param {GLEnum} [options.minFilter=LINEAR_MIPMAP_NEAREST] Minification filter.
        @param {GLEnum} [options.magFilter=LINEAR] Magnification filter.
        @param {GLEnum} [options.wrapS=REPEAT] Horizontal wrap mode.
        @param {GLEnum} [options.wrapT=REPEAT] Vertical wrap mode.
        @param {GLEnum} [options.compareMode=NONE] Comparison mode.
        @param {GLEnum} [options.compareFunc=LEQUAL] Comparison function.
        @param {GLEnum} [options.baseLevel] Base mipmap level. 
        @param {GLEnum} [options.maxLevel] Maximum mipmap level.
        @param {GLEnum} [options.minLOD] Mimimum level of detail.
        @param {GLEnum} [options.maxLOD] Maximum level of detail.
        @param {boolean} [options.generateMipmaps] Should mipmaps be generated.
    */
    PicoGL.App.prototype.createTexture2D = function(image, width, height, options) {
        if (height === undefined) {
            // Passing in a DOM element. Height/width not required.
            options = width;
            width = image.width;
            height = image.height;
        }

        return new PicoGL.Texture(this.gl, this.state, this.gl.TEXTURE_2D, image, width, height, null, false, options);
    };

    /**
        Create a 2D texture array.

        @method
        @param {ArrayBufferView} image Typed array containing pixel data.
        @param {number} width Texture width.
        @param {number} height Texture height.
        @param {number} size Number of images in the array.
        @param {Object} [options] Texture options.
        @param {GLEnum} [options.type=UNSIGNED_BYTE] Type of data stored in the texture.
        @param {GLEnum} [options.format=RGBA] Texture data format.
        @param {GLEnum} [options.internalFormat=RGBA] Texture data internal format.
        @param {boolean} [options.flipY=false] Whether the y-axis be flipped when unpacking the texture.
        @param {GLEnum} [options.minFilter=LINEAR_MIPMAP_NEAREST] Minification filter.
        @param {GLEnum} [options.magFilter=LINEAR] Magnification filter.
        @param {GLEnum} [options.wrapS=REPEAT] Horizontal wrap mode.
        @param {GLEnum} [options.wrapT=REPEAT] Vertical wrap mode.
        @param {GLEnum} [options.compareMode=NONE] Comparison mode.
        @param {GLEnum} [options.compareFunc=LEQUAL] Comparison function.
        @param {GLEnum} [options.baseLevel] Base mipmap level. 
        @param {GLEnum} [options.maxLevel] Maximum mipmap level.
        @param {GLEnum} [options.minLOD] Mimimum level of detail.
        @param {GLEnum} [options.maxLOD] Maximum level of detail.
        @param {boolean} [options.generateMipmaps] Should mipmaps be generated.
    */
    PicoGL.App.prototype.createTextureArray = function(image, width, height, depth, options) {
        return new PicoGL.Texture(this.gl, this.state, this.gl.TEXTURE_2D_ARRAY, image, width, height, depth, true, options);
    };

    /**
        Create a 3D texture.

        @method
        @param {ArrayBufferView} image Typed array containing pixel data.
        @param {number} width Texture width.
        @param {number} height Texture height.
        @param {number} depth Texture depth.
        @param {Object} [options] Texture options.
        @param {GLEnum} [options.type=UNSIGNED_BYTE] Type of data stored in the texture.
        @param {GLEnum} [options.format=RGBA] Texture data format.
        @param {GLEnum} [options.internalFormat=RGBA] Texture data internal format.
        @param {boolean} [options.flipY=false] Whether the y-axis be flipped when unpacking the texture.
        @param {GLEnum} [options.minFilter=LINEAR_MIPMAP_NEAREST] Minification filter.
        @param {GLEnum} [options.magFilter=LINEAR] Magnification filter.
        @param {GLEnum} [options.wrapS=REPEAT] Horizontal wrap mode.
        @param {GLEnum} [options.wrapT=REPEAT] Vertical wrap mode.
        @param {GLEnum} [options.wrapR=REPEAT] Depth wrap mode.
        @param {GLEnum} [options.compareMode=NONE] Comparison mode.
        @param {GLEnum} [options.compareFunc=LEQUAL] Comparison function.
        @param {GLEnum} [options.baseLevel] Base mipmap level. 
        @param {GLEnum} [options.maxLevel] Maximum mipmap level.
        @param {GLEnum} [options.minLOD] Mimimum level of detail.
        @param {GLEnum} [options.maxLOD] Maximum level of detail.
        @param {boolean} [options.generateMipmaps] Should mipmaps be generated.
    */
    PicoGL.App.prototype.createTexture3D = function(image, width, height, depth, options) {
        return new PicoGL.Texture(this.gl, this.state, this.gl.TEXTURE_3D, image, width, height, depth, true, options);
    };

    /**
        Create a cubemap.

        @method
        @param {Object} options Texture options.
        @param {DOMElement|ArrayBufferView} options.negX The image data for the negative X direction.
                Can be any format that would be accepted by texImage2D.
        @param {DOMElement|ArrayBufferView} options.posX The image data for the positive X direction.
                Can be any format that would be accepted by texImage2D.
        @param {DOMElement|ArrayBufferView} options.negY The image data for the negative Y direction.
                Can be any format that would be accepted by texImage2D.
        @param {DOMElement|ArrayBufferView} options.posY The image data for the positive Y direction.
                Can be any format that would be accepted by texImage2D.
        @param {DOMElement|ArrayBufferView} options.negZ The image data for the negative Z direction.
                Can be any format that would be accepted by texImage2D.
        @param {DOMElement|ArrayBufferView} options.posZ The image data for the positive Z direction.
                Can be any format that would be accepted by texImage2D.
        @param {GLEnum} [options.type=UNSIGNED_BYTE] Type of data stored in the texture.
        @param {GLEnum} [options.format=RGBA] Texture data format.
        @param {GLEnum} [options.internalFormat=RGBA] Texture data internal format.
        @param {number} [options.width] Texture width. Required when passing array data.
        @param {number} [options.height] Texture height. Required when passing array data.
        @param {boolean} [options.flipY=false] Whether the y-axis be flipped when unpacking the texture.
        @param {GLEnum} [options.minFilter=LINEAR_MIPMAP_NEAREST] Minification filter.
        @param {GLEnum} [options.magFilter=LINEAR] Magnification filter.
        @param {GLEnum} [options.wrapS=REPEAT] Horizontal wrap mode.
        @param {GLEnum} [options.wrapT=REPEAT] Vertical wrap mode.
        @param {GLEnum} [options.compareMode=NONE] Comparison mode.
        @param {GLEnum} [options.compareFunc=LEQUAL] Comparison function.
        @param {boolean} [options.generateMipmaps] Should mipmaps be generated.
    */
    PicoGL.App.prototype.createCubemap = function(options) {
        return new PicoGL.Cubemap(this.gl, this.state, options);
    };

    /**
        Create a framebuffer.

        @method
        @param {number} [width=app.width] Width of the framebuffer.
        @param {number} [height=app.height] Height of the framebuffer.
    */
    PicoGL.App.prototype.createFramebuffer = function(width, height) {
        return new PicoGL.Framebuffer(this.gl, this.state, width, height);
    };

    /**
        Create a DrawCall. A DrawCall manages the state associated with 
        a WebGL draw call including a program and associated vertex data, textures, 
        uniforms and uniform blocks.

        @method
        @param {Program} program The program to use for this DrawCall.
        @param {VertexArray} vertexArray Vertex data to use for drawing.
        @param {GLEnum} [primitive=TRIANGLES] Type of primitive to draw.
    */
    PicoGL.App.prototype.createDrawCall = function(program, vertexArray, primitive) {
        return new PicoGL.DrawCall(this.gl, program, vertexArray, primitive);
    };

    /** 
        Execute the currently attached list of DrawCalls.

        @method
    */
    PicoGL.App.prototype.draw = function() {
        for (var i = 0, len = this.currentDrawCalls.length; i < len; i++) {
            this.currentDrawCalls[i].draw(this.state);
        }

        return this;
    };

    /** 
        Start the rendering timer.

        @method
    */
    PicoGL.App.prototype.timerStart = function() {
        this.timer.start();

        return this;
    };

    /** 
        Stop the rendering timer.

        @method
    */
    PicoGL.App.prototype.timerEnd = function() {
        this.timer.end();

        return this;
    };

    /** 
        Check if the rendering time is available. If
        this method returns true, the cpuTime and
        gpuTime properties will be set to valid 
        values.

        @method
    */
    PicoGL.App.prototype.timerReady = function() {
        if (this.timer.ready()) {
            this.cpuTime = this.timer.cpuTime;
            this.gpuTime = this.timer.gpuTime;
            return true;
        } else {
            return false;
        }
    };



})();
;(function() {
    "use strict";


    /**
        WebGL program consisting of compiled and linked vertex and fragment
        shaders.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {WebGLProgram} program The WebGL program.
        @prop {boolean} transformFeedback Whether this program is set up for transform feedback.
        @prop {Object} uniforms Map of uniform names to handles.
        @prop {Object} uniformBlocks Map of uniform block names to handles.
    */
    PicoGL.Program = function Program(gl, vsSource, fsSource, xformFeebackVars) {
        var i;

        var vShader, fShader;

        var ownVertexShader = false;
        var ownFragmentShader = false;
        if (typeof vsSource === "string") {
            vShader = new PicoGL.Shader(gl, gl.VERTEX_SHADER, vsSource);
            ownVertexShader = true;
        } else {
            vShader = vsSource;
        }

        if (typeof fsSource === "string") {
            fShader = new PicoGL.Shader(gl, gl.FRAGMENT_SHADER, fsSource);
            ownFragmentShader = true;
        } else {
            fShader = fsSource;
        }

        var program = gl.createProgram();
        gl.attachShader(program, vShader.shader);
        gl.attachShader(program, fShader.shader);
        if (xformFeebackVars) {
            gl.transformFeedbackVaryings(program, xformFeebackVars, gl.SEPARATE_ATTRIBS);
        }
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error(gl.getProgramInfoLog(program));
        }

        if (ownVertexShader) {
            vShader.delete();
        }

        if (ownFragmentShader) {
           fShader.delete();
        }

        this.gl = gl;
        this.program = program;
        this.transformFeedback = !!xformFeebackVars;
        this.uniforms = {};
        this.uniformBlocks = {};
        this.uniformBlockBindings = {};

        var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (i = 0; i < numUniforms; ++i) {
            var uniformInfo = gl.getActiveUniform(program, i);
            var uniformHandle = gl.getUniformLocation(this.program, uniformInfo.name);
            var UniformClass = null;
            var type = uniformInfo.type;
            var numElements = uniformInfo.size;

            switch (type) {
                case PicoGL.INT:
                case PicoGL.SAMPLER_2D:
                case PicoGL.INT_SAMPLER_2D:
                case PicoGL.UNSIGNED_INT_SAMPLER_2D:
                case PicoGL.SAMPLER_2D_SHADOW:
                case PicoGL.SAMPLER_2D_ARRAY:
                case PicoGL.INT_SAMPLER_2D_ARRAY:
                case PicoGL.UNSIGNED_INT_SAMPLER_2D_ARRAY:
                case PicoGL.SAMPLER_2D_ARRAY_SHADOW:
                case PicoGL.SAMPLER_CUBE:
                case PicoGL.INT_SAMPLER_CUBE:
                case PicoGL.UNSIGNED_INT_SAMPLER_CUBE:
                case PicoGL.SAMPLER_CUBE_SHADOW:
                case PicoGL.SAMPLER_3D:
                case PicoGL.INT_SAMPLER_3D:
                case PicoGL.UNSIGNED_INT_SAMPLER_3D:
                case PicoGL.UNSIGNED_INT:
                case PicoGL.FLOAT:
                    UniformClass = numElements > 1 ? PicoGL.MultiNumericUniform : PicoGL.SingleComponentUniform;
                    break;
                case PicoGL.BOOL:
                    UniformClass = numElements > 1 ? PicoGL.MultiBoolUniform : PicoGL.SingleComponentUniform;
                    break;
                case PicoGL.FLOAT_VEC2:
                case PicoGL.INT_VEC2:
                case PicoGL.UNSIGNED_INT_VEC2:
                case PicoGL.FLOAT_VEC3:
                case PicoGL.INT_VEC3:
                case PicoGL.UNSIGNED_INT_VEC3:
                case PicoGL.FLOAT_VEC4:
                case PicoGL.INT_VEC4:
                case PicoGL.UNSIGNED_INT_VEC4:
                    UniformClass = PicoGL.MultiNumericUniform;
                    break;
                case PicoGL.BOOL_VEC2:
                case PicoGL.BOOL_VEC3:
                case PicoGL.BOOL_VEC4:
                    UniformClass = PicoGL.MultiBoolUniform;
                    break;
                case PicoGL.FLOAT_MAT2:
                case PicoGL.FLOAT_MAT3:
                case PicoGL.FLOAT_MAT4:
                case PicoGL.FLOAT_MAT2x3:
                case PicoGL.FLOAT_MAT2x4:
                case PicoGL.FLOAT_MAT3x2:
                case PicoGL.FLOAT_MAT3x4:
                case PicoGL.FLOAT_MAT4x2:
                case PicoGL.FLOAT_MAT4x3:
                    UniformClass = PicoGL.MatrixUniform;
                    break;
                default:
                    console.error("Unrecognized type for uniform ", uniformInfo.name);
                    break;
            }

            this.uniforms[uniformInfo.name] = new UniformClass(gl, uniformHandle, type, numElements);
        }

        var numUniformBlocks = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS);

        for (i = 0; i < numUniformBlocks; ++i) {
            var blockName = gl.getActiveUniformBlockName(this.program, i);
            var blockIndex = gl.getUniformBlockIndex(this.program, blockName);

            this.uniformBlocks[blockName] = blockIndex;
        }
    };

    /**
        Delete this program.

        @method
    */
    PicoGL.Program.prototype.delete = function() {
        if (this.program) {
            this.gl.deleteProgram(this.program);
            this.program = null;
        }
    };

    // Set the value of a uniform.
    PicoGL.Program.prototype.uniform = function(name, value) {
        this.uniforms[name].set(value);
    };

    // Bind a uniform block to a uniform buffer base.
    PicoGL.Program.prototype.uniformBlock = function(name, base) {
        if (this.uniformBlockBindings[name] !== base) {
            this.gl.uniformBlockBinding(this.program, this.uniformBlocks[name], base);
            this.uniformBlockBindings[name] = base;
        }

    };

})();
;(function() {
    "use strict";

    /**
        WebGL shader.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {WebGLShader} shader The shader.
    */
    PicoGL.Shader = function(gl, type, source) {
        this.gl = gl;
        this.shader = gl.createShader(type);
        gl.shaderSource(this.shader, source);
        gl.compileShader(this.shader);

        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
            var i, lines;

            console.error(gl.getShaderInfoLog(this.shader));
            lines = source.split("\n");
            for (i = 0; i < lines.length; ++i) {
                console.error((i + 1) + ":", lines[i]);
            }
        }
    };

    /**
        Delete this shader.

        @method
    */
    PicoGL.Shader.prototype.delete = function() {
        if (this.shader) {
            this.gl.deleteShader(this.shader);
            this.shader = null;
        }
    };

})();
;(function() {
    "use strict";

    /**
        Storage for vertex data.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {WebGLVertexArrayObject} vertexArray Vertex array object.
        @prop {number} numElements Number of elements in the vertex array.
        @prop {boolean} indexed Whether this vertex array is set up for indexed drawing.
        @prop {GLenum} indexType Data type of the indices.
        @prop {boolean} instanced Whether this vertex array is set up for instanced drawing.
        @prop {number} numInstances Number of instances to draw with this vertex array.
    */
    PicoGL.VertexArray = function VertexArray(gl) {
        this.gl = gl;
        this.vertexArray = gl.createVertexArray();
        this.numElements = 0;
        this.indexType = null;
        this.instancedBuffers = 0;
        this.indexed = false;
        this.numInstances = 0;
    };

    /**
        Bind an per-vertex attribute buffer to this vertex array.

        @method
        @param {number} attributeIndex The attribute location to bind to.
        @param {VertexBuffer} vertexBuffer The VertexBuffer to bind.
    */
    PicoGL.VertexArray.prototype.vertexAttributeBuffer = function(attributeIndex, vertexBuffer) {
        this.attributeBuffer(attributeIndex, vertexBuffer, false);

        return this;
    };

    /**
        Bind an per-instance attribute buffer to this vertex array.

        @method
        @param {number} attributeIndex The attribute location to bind to.
        @param {VertexBuffer} vertexBuffer The VertexBuffer to bind.
    */
    PicoGL.VertexArray.prototype.instanceAttributeBuffer = function(attributeIndex, vertexBuffer) {
        this.attributeBuffer(attributeIndex, vertexBuffer, true);

        return this;
    };

    /**
        Bind an index buffer to this vertex array.

        @method
        @param {VertexBuffer} vertexBuffer The VertexBuffer to bind.
    */
    PicoGL.VertexArray.prototype.indexBuffer = function(vertexBuffer) {
        this.gl.bindVertexArray(this.vertexArray);
        this.gl.bindBuffer(vertexBuffer.binding, vertexBuffer.buffer);

        this.numElements = vertexBuffer.numItems * 3;
        this.indexType = vertexBuffer.type;
        this.indexed = true;

        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(vertexBuffer.binding, null);

        return this;
    };

    /**
        Delete this vertex array.

        @method
    */
    PicoGL.VertexArray.prototype.delete = function() {
        if (this.vertexArray) {
            this.gl.deleteVertexArray(this.vertexArray);
            this.vertexArray = null;
        }
        this.gl.bindVertexArray(null);

        return this;
    };

    // Bind this vertex array.
    PicoGL.VertexArray.prototype.bind = function() {
        this.gl.bindVertexArray(this.vertexArray);

        return this;
    };

    // Attach an attribute buffer
    PicoGL.VertexArray.prototype.attributeBuffer = function(attributeIndex, vertexBuffer, instanced) {
        this.gl.bindVertexArray(this.vertexArray);
        this.gl.bindBuffer(vertexBuffer.binding, vertexBuffer.buffer);

        var numColumns = vertexBuffer.numColumns;

        for (var i = 0; i < numColumns; ++i) {
            if (vertexBuffer.type === this.gl.FLOAT) {
                this.gl.vertexAttribPointer(
                    attributeIndex + i, 
                    vertexBuffer.itemSize, 
                    vertexBuffer.type, 
                    false, 
                    numColumns * vertexBuffer.itemSize * PicoGL.TYPE_SIZE[vertexBuffer.type], 
                    i * vertexBuffer.itemSize * PicoGL.TYPE_SIZE[vertexBuffer.type]);
            } else {
                this.gl.vertexAttribIPointer(
                    attributeIndex + i, 
                    vertexBuffer.itemSize, 
                    vertexBuffer.type, 
                    numColumns * vertexBuffer.itemSize * PicoGL.TYPE_SIZE[vertexBuffer.type], 
                    i * vertexBuffer.itemSize * PicoGL.TYPE_SIZE[vertexBuffer.type]);
            }
            
            if (instanced) {
                this.gl.vertexAttribDivisor(attributeIndex + i, 1);
            }

            this.gl.enableVertexAttribArray(attributeIndex + i);
        }
        
        this.instanced = this.instanced || instanced;

        if (instanced) {
            this.numInstances = vertexBuffer.numItems; 
        } else {
            this.numElements = this.numElements || vertexBuffer.numItems; 
        }

        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(vertexBuffer.binding, null);

        return this;
    };

})();
;(function() {
    "use strict";

    /**
        Tranform feedback object.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {WebGLTransformFeedback} transformFeedback Transform feedback object.
    */
    PicoGL.TransformFeedback = function TransformFeedback(gl) {
        this.gl = gl;
        this.transformFeedback = gl.createTransformFeedback();
        // TODO(Tarek): Need to rebind buffers due to bug in ANGLE.
        // Remove this when that's fixed.
        this.angleBugBuffers = [];
    };

     /**
        Bind a feedback buffer to capture transform output.

        @method
        @param {number} index Index of transform feedback varying to capture.
        @param {VertexBuffer} buffer Buffer to record output into.
    */
    PicoGL.TransformFeedback.prototype.feedbackBuffer = function(index, buffer) {
        this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, this.transformFeedback);
        this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, index, buffer.buffer);
        this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null);
        this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, index, null);

        this.angleBugBuffers[index] = buffer;

        return this;
    };

    /**
        Delete this transform feedback.

        @method
    */
    PicoGL.TransformFeedback.prototype.delete = function() {
        if (this.transformFeedback) {
            this.gl.deleteTransformFeedback(this.transformFeedback);
            this.transformFeedback = null;
        }
    }; 

    // Bind this transform feedback.
    PicoGL.TransformFeedback.prototype.bind = function() {
        this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, this.transformFeedback);

        for (var i = 0, len = this.angleBugBuffers.length; i < len; ++i) {
            this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, i, this.angleBugBuffers[i].buffer);
        }

        return this;
    };

})();
;(function() {
    "use strict";

    /**
        Storage for vertex data.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {WebGLBuffer} buffer Allocated buffer storage.
        @prop {GLEnum} type The type of data stored in the buffer.
        @prop {number} itemSize Number of array elements per vertex.
        @prop {number} numItems Number of vertices represented.
        @prop {GLEnum} usage The usage pattern of the buffer.
        @prop {boolean} indexArray Whether this is an index array.
        @prop {GLEnum} binding GL binding point (ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER).
    */
    PicoGL.VertexBuffer = function VertexBuffer(gl, type, itemSize, data, usage, indexArray) {
        var numColumns;
        switch(type) {
            case PicoGL.FLOAT_MAT4:
            case PicoGL.FLOAT_MAT4x2:
            case PicoGL.FLOAT_MAT4x3:
                numColumns = 4;
                break;
            case PicoGL.FLOAT_MAT3:
            case PicoGL.FLOAT_MAT3x2:
            case PicoGL.FLOAT_MAT3x4:
                numColumns = 3;
                break;
            case PicoGL.FLOAT_MAT2:
            case PicoGL.FLOAT_MAT2x3:
            case PicoGL.FLOAT_MAT2x4:
                numColumns = 2;
                break;
            default:
                numColumns = 1;
        }

        switch(type) {
            case PicoGL.FLOAT_MAT4:
            case PicoGL.FLOAT_MAT3x4:
            case PicoGL.FLOAT_MAT2x4:
                itemSize = 4;
                type = PicoGL.FLOAT;
                break;
            case PicoGL.FLOAT_MAT3:
            case PicoGL.FLOAT_MAT4x3:
            case PicoGL.FLOAT_MAT2x3:
                itemSize = 3;
                type = PicoGL.FLOAT;
                break;
            case PicoGL.FLOAT_MAT2:
            case PicoGL.FLOAT_MAT3x2:
            case PicoGL.FLOAT_MAT4x2:
                itemSize = 2;
                type = PicoGL.FLOAT;
                break;
        }

        var dataLength;
        if (typeof data === "number") {
            dataLength = data;
            data *= PicoGL.TYPE_SIZE[type];
        } else {
            dataLength = data.length;
        }

        this.gl = gl;
        this.buffer = gl.createBuffer();
        this.type = type;
        this.itemSize = itemSize;
        this.numItems = dataLength / (itemSize * numColumns);
        this.numColumns = numColumns;
        this.usage = usage || gl.STATIC_DRAW;
        this.indexArray = !!indexArray;
        this.binding = this.indexArray ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;

        gl.bindBuffer(this.binding, this.buffer);
        gl.bufferData(this.binding, data, this.usage);
        gl.bindBuffer(this.binding, null);
    };

    /**
        Update data in this buffer.

        @method
        @param {VertexBufferView} data Data to store in the buffer.
    */
    PicoGL.VertexBuffer.prototype.data = function(data) {
        this.gl.bindBuffer(this.binding, this.buffer);
        this.gl.bufferSubData(this.binding, 0, data);
        this.gl.bindBuffer(this.binding, null);

        return this;
    };

    /**
        Delete this array buffer.

        @method
    */
    PicoGL.VertexBuffer.prototype.delete = function() {
        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
            this.buffer = null;    
        }
    };

})();
;(function() {
    "use strict";

    // Classes to manage uniform value updates, including
    // caching current values.

    PicoGL.SingleComponentUniform = function SingleComponentUniform(gl, handle, type) {
        this.gl = gl;
        this.handle = handle;
        this.glFuncName = PicoGL.UNIFORM_FUNC_NAME[type];
        this.cache = type === PicoGL.BOOL ? false : 0;
    };

    PicoGL.SingleComponentUniform.prototype.set = function(value) {
        if (this.cache !== value) {
            this.gl[this.glFuncName](this.handle, value);
            this.cache = value;
        }
    };

    PicoGL.MultiNumericUniform = function MultiNumericUniform(gl, handle, type, count) {
        this.gl = gl;
        this.handle = handle;
        this.glFuncName = PicoGL.UNIFORM_FUNC_NAME[type] + "v";
        this.count = count;
        this.cache = new PicoGL.UNIFORM_CACHE_CLASS[type](PicoGL.UNIFORM_COMPONENT_COUNT[type] * count);
    };

    PicoGL.MultiNumericUniform.prototype.set = function(value) {
        for (var i = 0, len = value.length; i < len; ++i) {
            if (this.cache[i] !== value[i]) {
                this.gl[this.glFuncName](this.handle, value);
                this.cache.set(value);
                return;
            }
        }
    };

    PicoGL.MultiBoolUniform = function MultiBoolUniform(gl, handle, type, count) {
        this.gl = gl;
        this.handle = handle;
        this.glFuncName = PicoGL.UNIFORM_FUNC_NAME[type] + "v";
        this.count = count;
        this.cache = new Array(PicoGL.UNIFORM_COMPONENT_COUNT[type] * count).fill(false);
    };

    PicoGL.MultiBoolUniform.prototype.set = function(value) {
        for (var i = 0, len = value.length; i < len; ++i) {
            if (this.cache[i] !== value[i]) {
                this.gl[this.glFuncName](this.handle, value);
                for (var j = i; j < len; j++) {
                    this.cache[j] = value[j];
                }
                return;
            }
        }
    };

    PicoGL.MatrixUniform = function MatrixUniform(gl, handle, type, count) {
        this.gl = gl;
        this.handle = handle;
        this.glFuncName = PicoGL.UNIFORM_FUNC_NAME[type];
        this.count = count;
        this.cache = new Float32Array(PicoGL.UNIFORM_COMPONENT_COUNT[type] * count);
    };

    PicoGL.MatrixUniform.prototype.set = function(value) {
        for (var i = 0, len = value.length; i < len; ++i) {
            if (this.cache[i] !== value[i]) {
                this.gl[this.glFuncName](this.handle, false, value);
                this.cache.set(value);
                return;
            }
        }
    };

})();
;(function() {
    "use strict";

    /**
        Storage for uniform data. Data is stored in std140 layout.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {WebGLBuffer} buffer Allocated buffer storage.
        @prop {Float32Array} data Buffer data.
        @prop {Object} dataViews Map of base data types to matching ArrayBufferViews of the buffer data.
        @prop {Array} offsets Offsets into the array for each item in the buffer.
        @prop {Array} sizes Size of the item at the given offset.
        @prop {Array} types The base type of the item at the given offset (FLOAT, INT or UNSIGNED_INT).
        @prop {number} size The size of the buffer (in 4-byte items).
        @prop {GLEnum} usage Usage pattern of the buffer.
    */
    PicoGL.UniformBuffer = function UniformBuffer(gl, layout, usage) {
        this.gl = gl;
        this.buffer = gl.createBuffer();
        this.dataViews = {};
        this.offsets = new Array(layout.length);
        this.sizes = new Array(layout.length);
        this.types = new Array(layout.length);
        this.size = 0;
        this.usage = usage || gl.DYNAMIC_DRAW;

        for (var i = 0, len = layout.length; i < len; ++i) {
            var type = layout[i];
            switch(type) { 
                case PicoGL.FLOAT:
                case PicoGL.INT:
                case PicoGL.UNSIGNED_INT:
                case PicoGL.BOOL:
                    this.offsets[i] = this.size;
                    this.sizes[i] = 1;

                    if (type === PicoGL.INT) {
                        this.types[i] = PicoGL.INT;
                    } else if (this.type === PicoGL.UNSIGNED_INT) {
                        this.types[i] = PicoGL.UNSIGNED_INT;
                    } else {
                        this.types[i] = PicoGL.FLOAT;
                    }

                    this.size++;
                    break;
                case PicoGL.FLOAT_VEC2:
                case PicoGL.INT_VEC2:
                case PicoGL.UNSIGNED_INT_VEC2:
                case PicoGL.BOOL_VEC2:
                    this.size += this.size % 2;
                    this.offsets[i] = this.size;
                    this.sizes[i] = 2;
                    
                    if (type === PicoGL.INT_VEC2) {
                        this.types[i] = PicoGL.INT;
                    } else if (this.type === PicoGL.UNSIGNED_INT_VEC2) {
                        this.types[i] = PicoGL.UNSIGNED_INT;
                    } else {
                        this.types[i] = PicoGL.FLOAT;
                    }

                    this.size += 2;
                    break;
                case PicoGL.FLOAT_VEC3:
                case PicoGL.INT_VEC3:
                case PicoGL.UNSIGNED_INT_VEC3:
                case PicoGL.BOOL_VEC3:
                case PicoGL.FLOAT_VEC4:
                case PicoGL.INT_VEC4:
                case PicoGL.UNSIGNED_INT_VEC4:
                case PicoGL.BOOL_VEC4:
                    this.size += (4 - this.size % 4) % 4;
                    this.offsets[i] = this.size;
                    this.sizes[i] = 4;
                    
                    if (type === PicoGL.INT_VEC4 || type === PicoGL.INT_VEC3) {
                        this.types[i] = PicoGL.INT;
                    } else if (this.type === PicoGL.UNSIGNED_INT_VEC4 || this.type === PicoGL.UNSIGNED_INT_VEC3) {
                        this.types[i] = PicoGL.UNSIGNED_INT;
                    } else {
                        this.types[i] = PicoGL.FLOAT;
                    }

                    this.size += 4;
                    break;
                case PicoGL.FLOAT_MAT2:
                case PicoGL.FLOAT_MAT2x3:
                case PicoGL.FLOAT_MAT2x4:
                    this.size += (4 - this.size % 4) % 4;
                    this.offsets[i] = this.size;
                    this.sizes[i] = 8;
                    this.types[i] = PicoGL.FLOAT;

                    this.size += 8;
                    break;
                case PicoGL.FLOAT_MAT3:
                case PicoGL.FLOAT_MAT3x2:
                case PicoGL.FLOAT_MAT3x4:
                    this.size += (4 - this.size % 4) % 4;
                    this.offsets[i] = this.size;
                    this.sizes[i] = 12;
                    this.types[i] = PicoGL.FLOAT;

                    this.size += 12;
                    break;
                case PicoGL.FLOAT_MAT4:
                case PicoGL.FLOAT_MAT4x2:
                case PicoGL.FLOAT_MAT4x3:
                    this.size += (4 - this.size % 4) % 4;
                    this.offsets[i] = this.size;
                    this.sizes[i] = 16;
                    this.types[i] = PicoGL.FLOAT;

                    this.size += 16;
                    break;
                default:
                    console.error("Unsupported type for uniform buffer.");
            }
        }

        this.size += (4 - this.size % 4) % 4;

        this.data = new Float32Array(this.size);
        this.dataViews[PicoGL.FLOAT] = this.data;
        this.dataViews[PicoGL.INT] = new Int32Array(this.data.buffer);
        this.dataViews[PicoGL.UNSIGNED_INT] = new Uint32Array(this.data.buffer);

        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, 0, this.buffer);
        this.gl.bufferData(this.gl.UNIFORM_BUFFER, this.size * 4, this.usage);
        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, 0, null);
    };

    /**
        Update data for a given item in the buffer. NOTE: Data is not 
        sent the the GPU until the update() method is called!

        @method
        @param {number} index Index in the layout of item to set.
        @param {ArrayBufferView} value Value to store at the layout location.
    */
    PicoGL.UniformBuffer.prototype.set = function(index, value) {
        var view = this.dataViews[this.types[index]];

        if (this.sizes[index] === 1)  {
            view[this.offsets[index]] = value;
        } else {
            view.set(value, this.offsets[index]);
        }
        
        return this;
    };

    /**
        Send stored buffer data to the GPU.

        @param {number} [index] Index in the layout of item to send to the GPU. If ommited, entire buffer is sent.
        @method
    */
    PicoGL.UniformBuffer.prototype.update = function(index) {
        var data;
        var offset;
        if (index === undefined) {
            data = this.data;
            offset = 0;
        } else {
            var begin = this.offsets[index];
            var end = begin + this.sizes[index];
            data = this.data.subarray(begin, end);
            offset = begin * 4;
        }

        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, 0, this.buffer);
        this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, offset, data);
        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, 0, null);

        return this;
    };

    /**
        Delete this uniform buffer.

        @method
    */
    PicoGL.UniformBuffer.prototype.delete = function() {
        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
            this.buffer = null;
        }
    };

    // Bind this uniform buffer to the given base.
    PicoGL.UniformBuffer.prototype.bind = function(base) {
        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, base, this.buffer);

        return this;
    };

})();
;(function() {
    "use strict";

    /**
        General-purpose texture.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {WebGLTexture} texture Handle to the texture.
        @prop {WebGLSamler} sampler Sampler object.
        @prop {GLEnum} binding Binding point for the texture.
        @prop {GLEnum} type Type of data stored in the texture.
        @prop {GLEnum} format Layout of texture data.
        @prop {GLEnum} internalFormat Internal arrangement of the texture data.
        @prop {Number} unit The texture unit this texture is bound to.
        @prop {GLEnum} unitEnum The GLEnum of texture unit this texture is bound to.
        @prop {boolean} is3D Whether this texture contains 3D data.
        @prop {Object} appState Tracked GL state.
    */
    PicoGL.Texture = function Texture(gl, appState, binding, image, width, height, depth, is3D, options) {
        options = options || PicoGL.DUMMY_OBJECT;

        this.gl = gl;
        this.binding = binding;
        this.texture = gl.createTexture();
        this.width = -1;
        this.height = -1;
        this.depth = -1;
        this.format = options.format !== undefined ? options.format : gl.RGBA;
        this.type = options.type !== undefined ? options.type : gl.UNSIGNED_BYTE;
        this.internalFormat = options.internalFormat !== undefined ? options.internalFormat : PicoGL.TEXTURE_INTERNAL_FORMAT[this.type][this.format];
        this.is3D = is3D;
        this.appState = appState;
        if (appState.freeTextureUnits.length > 0) {
            this.unit = appState.freeTextureUnits.pop();
        } else {
            /////////////////////////////////////////////////////////////////////////////////
            // TODO(Tarek):
            // Workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=722288
            // Use full array when that's fixed
            /////////////////////////////////////////////////////////////////////////////////
            this.unit = appState.textureCount % (appState.textures.length - 1);
            this.unit += 1;

            ++appState.textureCount;
        }
        this.unitEnum = gl.TEXTURE0 + this.unit;

        // Sampler parameters
        var minFilter = options.minFilter !== undefined ? options.minFilter : gl.LINEAR_MIPMAP_NEAREST;
        var magFilter = options.magFilter !== undefined ? options.magFilter : gl.LINEAR;
        var wrapS = options.wrapS !== undefined ? options.wrapS : gl.REPEAT;
        var wrapT = options.wrapT !== undefined ? options.wrapT : gl.REPEAT;
        var wrapR = options.wrapR !== undefined ? options.wrapR : gl.REPEAT;
        var compareMode = options.compareMode !== undefined ? options.compareMode : gl.NONE;
        var compareFunc = options.compareFunc !== undefined ? options.compareFunc : gl.LEQUAL;
        var minLOD = options.minLOD !== undefined ? options.minLOD : null;
        var maxLOD = options.maxLOD !== undefined ? options.maxLOD : null;

        this.sampler = gl.createSampler();
        gl.samplerParameteri(this.sampler, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_S, wrapS);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_T, wrapT);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_R, wrapR);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_COMPARE_FUNC, compareFunc);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_COMPARE_MODE, compareMode);
        if (minLOD !== null) {
            gl.samplerParameterf(this.sampler, gl.TEXTURE_MIN_LOD, minLOD);
        }
        if (maxLOD !== null) {
            gl.samplerParameterf(this.sampler, gl.TEXTURE_MAX_LOD, maxLOD);
        }

        // Texture parameters
        this.flipY = options.flipY !== undefined ? options.flipY : false;
        this.baseLevel = options.baseLevel !== undefined ? options.baseLevel : null;
        this.maxLevel = options.maxLevel !== undefined ? options.maxLevel : null;
        this.generateMipmaps = options.generateMipmaps !== false && 
                            (minFilter === gl.LINEAR_MIPMAP_NEAREST || minFilter === gl.LINEAR_MIPMAP_LINEAR);

        this.bind(true);
        gl.bindSampler(this.unit, this.sampler);
        this.image(image, width, height, depth);
    };

    /**
        Set the image data for the texture.
    
        @method
        @param {ImageElement|ArrayBufferView} image Image data.
        @param {number} [width] Image width. Required when passing ArrayBufferView data.
        @param {number} [height] Image height. Required when passing ArrayBufferView data.
        @param {number} [depth] Image depth or number of images. Required when passing 3D or texture array data.
    */
    PicoGL.Texture.prototype.image = function(image, width, height, depth) {
        width = width || image.width;
        height = height || image.height;
        depth = depth || 0;

        if (width !== this.width || height !== this.height || depth !== this.depth) {
            this.gl.deleteTexture(this.texture);
            this.texture = this.gl.createTexture();

            this.bind(true);

            this.width = width || image.width;
            this.height = height || image.height;
            this.depth = depth || 0;

            this.allocateStorage();
        }

        if (image) {
            if (this.is3D) {
                this.gl.texSubImage3D(this.binding, 0, 0, 0, 0, this.width, this.height, this.depth, this.format, this.type, image);
            } else {
                this.gl.texSubImage2D(this.binding, 0, 0, 0, this.width, this.height, this.format, this.type, image);
            }

            if (this.generateMipmaps) {
                this.gl.generateMipmap(this.binding);
            }
        }

        return this;
    };  

    /**
        Delete this texture.

        @method
    */
    PicoGL.Texture.prototype.delete = function() {
        if (this.texture) {
            this.gl.deleteTexture(this.texture);
            this.gl.deleteSampler(this.sampler);
            this.texture = null;
            this.sampler = null;
            this.appState.freeTextureUnits.push(this.unit);
            this.appState.textures[this.unit] = null;
            this.unit = -1;
            this.unitEnum = -1;
        }
    }; 

    // Initialize storage
    PicoGL.Texture.prototype.allocateStorage = function() {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
        
        if (this.baseLevel !== null) {
            this.gl.texParameteri(this.binding, this.gl.TEXTURE_BASE_LEVEL, this.baseLevel);
        }
        if (this.maxLevel !== null) {
            this.gl.texParameteri(this.binding, this.gl.TEXTURE_MAX_LEVEL, this.maxLevel);
        }

        var levels;
        if (this.is3D) {
            if (this.generateMipmaps) {
                levels = Math.floor(Math.log2(Math.max(Math.max(this.width, this.height), this.depth))) + 1;
            } else {
                levels = 1;
            }
            this.gl.texStorage3D(this.binding, levels, this.internalFormat, this.width, this.height, this.depth);
        } else {
            if (this.generateMipmaps) {
                levels = Math.floor(Math.log2(Math.max(this.width, this.height))) + 1;
            } else {
                levels = 1;
            }
            this.gl.texStorage2D(this.binding, levels, this.internalFormat, this.width, this.height);
        }
    };

    // Activate this texture's texture unit.
    PicoGL.Texture.prototype.activateUnit = function() {
        if (this.appState.activeTexture !== this.unit) {
            this.gl.activeTexture(this.unitEnum);
            this.appState.activeTexture = this.unit;
        }
        
        return this;
    }; 

    // Bind this texture to a texture unit.
    PicoGL.Texture.prototype.bind = function(force) {
        if (force || this.appState.textures[this.unit] !== this) {
            this.activateUnit();
            this.gl.bindTexture(this.binding, this.texture);
            this.appState.textures[this.unit] = this;
        }
        
        return this;
    };   

})();
;(function() {
    "use strict";

    /**
        Cubemap for environment mapping.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {WebGLTexture} texture Handle to the texture.
        @prop {GLEnum} type Type of data stored in the texture.
        @prop {GLEnum} format Layout of texture data.
        @prop {GLEnum} internalFormat Internal arrangement of the texture data.
        @prop {Number} unit The texture unit this texture is bound to.
        @prop {GLEnum} unitEnum The GLEnum of texture unit this texture is bound to.
        @prop {Object} appState Tracked GL state.
    */
    PicoGL.Cubemap = function Cubemap(gl, appState, options) {
        options = options || PicoGL.DUMMY_OBJECT;

        this.gl = gl;
        this.texture = gl.createTexture();
        this.format = options.format !== undefined ? options.format : gl.RGBA;
        this.type = options.type !== undefined ? options.type : gl.UNSIGNED_BYTE;
        this.internalFormat = options.internalFormat !== undefined ? options.internalFormat : PicoGL.TEXTURE_INTERNAL_FORMAT[this.type][this.format];
        this.appState = appState;
        if (appState.freeTextureUnits.length > 0) {
            this.unit = appState.freeTextureUnits.pop();
        } else {
            /////////////////////////////////////////////////////////////////////////////////
            // TODO(Tarek):
            // Workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=722288
            // Use full array when that's fixed
            /////////////////////////////////////////////////////////////////////////////////
            this.unit = appState.textureCount % (appState.textures.length - 1);
            this.unit += 1;

            ++appState.textureCount;
        }
        this.unitEnum = gl.TEXTURE0 + this.unit;

        var negX = options.negX;
        var posX = options.posX;
        var negY = options.negY;
        var posY = options.posY;
        var negZ = options.negZ;
        var posZ = options.posZ;
        
        var width = options.width || negX.width;
        var height = options.height || negX.height;
        var flipY = options.flipY !== undefined ? options.flipY : false;
        var minFilter = options.minFilter !== undefined ? options.minFilter : gl.LINEAR_MIPMAP_NEAREST;
        var magFilter = options.magFilter !== undefined ? options.magFilter : gl.LINEAR;
        var compareMode = options.compareMode !== undefined ? options.compareMode : gl.NONE;
        var compareFunc = options.compareFunc !== undefined ? options.compareFunc : gl.LEQUAL;
        var generateMipmaps = options.generateMipmaps !== false && 
                            (minFilter === gl.LINEAR_MIPMAP_NEAREST || minFilter === gl.LINEAR_MIPMAP_LINEAR);

        this.bind();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_COMPARE_FUNC, compareFunc);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_COMPARE_MODE, compareMode);
        if (options.baseLevel !== undefined) {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_BASE_LEVEL, options.baseLevel);
        }
        if (options.maxLevel !== undefined) {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAX_LEVEL, options.maxLevel);
        }
        if (options.minLOD !== undefined) {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_LOD, options.minLOD);
        }
        if (options.maxLOD !== undefined) {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAX_LOD, options.maxLOD);
        }
        
        var levels = generateMipmaps ? Math.floor(Math.log2(Math.min(width, height))) + 1 : 1;
        gl.texStorage2D(gl.TEXTURE_CUBE_MAP, levels, this.internalFormat, width, height);

        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, 0, 0, width, height, this.format, this.type, negX);
        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, 0, 0, width, height, this.format, this.type, posX);
        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, 0, 0, width, height, this.format, this.type, negY);
        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, 0, 0, width, height, this.format, this.type, posY);
        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, 0, 0, width, height, this.format, this.type, negZ);
        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, 0, 0, width, height, this.format, this.type, posZ);

        if (generateMipmaps) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        }

    };

    /**
        Delete this cubemap.

        @method
    */
    PicoGL.Cubemap.prototype.delete = function() {
        if (this.texture) {
            this.gl.deleteTexture(this.texture);
            this.texture = null;
            this.appState.freeTextureUnits.push(this.unit);
            this.appState.textures[this.unit] = null;
            this.unit = -1;
            this.unitEnum = -1;
        }
    }; 

    // Bind this cubemap to a texture unit.
    PicoGL.Cubemap.prototype.bind = function() {
        if (this.appState.activeTexture !== this.unit) {
            this.gl.activeTexture(this.unitEnum);
            this.appState.activeTexture = this.unit;
        }
        if (this.appState.textures[this.unit] !== this) {  
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
            this.appState.textures[this.unit] = this;
        }
        
        return this;
    };   

})();
;(function() {
    "use strict";

    /**
        Storage for vertex data.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {WebGLFramebuffer} framebuffer Handle to the framebuffer.
        @prop {number} width The width of the framebuffer.
        @prop {number} height The height of the framebuffer.
        @prop {Array} colorTextures Array of color texture targets. 
        @prop {number} numColorTargets Number of color texture targets. 
        @prop {Texture} depthTexture Depth texture target. 
        @prop {Array} colorAttachments Array of color attachment enums. 
        @prop {Object} appState Tracked GL state.
    */
    PicoGL.Framebuffer = function Framebuffer(gl, appState, width, height) {
        this.gl = gl;
        this.framebuffer = gl.createFramebuffer();
        this.appState = appState;

        if (width && height) {
            this.width = width;
            this.height = height;
        } else {
            this.width = gl.drawingBufferWidth;
            this.height = gl.drawingBufferHeight;
        }

        this.numColorTargets = 0;

        this.colorTextures = [];
        this.colorAttachments = [];
        this.depthTexture = null;
    }; 

    /**
        Add a color target to this framebuffer.

        @method
        @param {number} [index=0] Color attachment index.
        @param {Object} [options] Texture options.
        @param {GLEnum} [options.type=UNSIGNED_BYTE] Type of data stored in the texture.
        @param {GLEnum} [options.format=RGBA] Texture data format.
        @param {GLEnum} [options.internalFormat=RGBA] Texture data internal format.
        @param {boolean} [options.flipY=true] Whether th y-axis be flipped when reading the texture.
        @param {GLEnum} [options.minFilter=NEAREST] Minification filter.
        @param {GLEnum} [options.magFilter=NEAREST] Magnification filter.
        @param {GLEnum} [options.wrapS=CLAMP_TO_EDGE] Horizontal wrap mode.
        @param {GLEnum} [options.wrapT=CLAMP_TO_EDGE] Vertical wrap mode.
        @param {GLEnum} [options.compareMode=NONE] Comparison mode.
        @param {GLEnum} [options.compareFunc=LEQUAL] Comparison function.
        @param {GLEnum} [options.baseLevel] Base mipmap level. 
        @param {GLEnum} [options.maxLevel] Maximum mipmap level.
        @param {GLEnum} [options.minLOD] Mimimum level of detail.
        @param {GLEnum} [options.maxLOD] Maximum level of detail.
        @param {boolean} [options.generateMipmaps=false] Should mipmaps be generated.
    */
    PicoGL.Framebuffer.prototype.colorTarget = function(index, options) {
        index = index || 0;
        options = options || {};
        options.type = options.type || this.gl.UNSIGNED_BYTE;
        options.format = options.format || this.gl.RGBA;
        options.internalFormat = options.internalFormat || PicoGL.TEXTURE_INTERNAL_FORMAT[options.type][options.format];
        options.minFilter = options.minFilter || this.gl.NEAREST;
        options.magFilter = options.magFilter || this.gl.NEAREST;
        options.wrapS = options.wrapS || this.gl.CLAMP_TO_EDGE;
        options.wrapT = options.wrapT || this.gl.CLAMP_TO_EDGE;
        options.generateMipmaps = options.generateMipmaps === undefined ? false : options.generateMipmaps;

        this.colorAttachments[index] = this.gl.COLOR_ATTACHMENT0 + index;
        
        var currentFramebuffer = this.bindAndCaptureState();

        this.colorTextures[index] = new PicoGL.Texture(
            this.gl,
            this.appState,
            this.gl.TEXTURE_2D,
            null, 
            this.width, 
            this.height, 
            null,
            false,
            options
        );

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.colorAttachments[index], this.gl.TEXTURE_2D, this.colorTextures[index].texture, 0);
        this.gl.drawBuffers(this.colorAttachments);
        this.numColorTargets++;

        this.restoreState(currentFramebuffer);

        return this;
    };

    /**
        Add a depth target to this framebuffer.

        @method
        @param {Object} [options] Texture options.
        @param {GLEnum} [options.type=UNSIGNED_BYTE] Type of data stored in the texture.
        @param {GLEnum} [options.format=RGBA] Texture data format.
        @param {GLEnum} [options.internalFormat=RGBA] Texture data internal format.
        @param {boolean} [options.flipY=true] Whether th y-axis be flipped when reading the texture.
        @param {GLEnum} [options.minFilter=NEAREST] Minification filter.
        @param {GLEnum} [options.magFilter=NEAREST] Magnification filter.
        @param {GLEnum} [options.wrapS=CLAMP_TO_EDGE] Horizontal wrap mode.
        @param {GLEnum} [options.wrapT=CLAMP_TO_EDGE] Vertical wrap mode.
        @param {GLEnum} [options.compareMode=NONE] Comparison mode.
        @param {GLEnum} [options.compareFunc=LEQUAL] Comparison function.
        @param {GLEnum} [options.baseLevel] Base mipmap level. 
        @param {GLEnum} [options.maxLevel] Maximum mipmap level.
        @param {GLEnum} [options.minLOD] Mimimum level of detail.
        @param {GLEnum} [options.maxLOD] Maximum level of detail.
        @param {boolean} [options.generateMipmaps=false] Should mipmaps be generated.
    */
    PicoGL.Framebuffer.prototype.depthTarget = function(options) {
        options = options || {};
        options.format = this.gl.DEPTH_COMPONENT;
        options.type = options.type || this.gl.UNSIGNED_SHORT;
        options.internalFormat = options.internalFormat || PicoGL.TEXTURE_INTERNAL_FORMAT[options.type][options.format];
        options.minFilter = options.minFilter || this.gl.NEAREST;
        options.magFilter = options.magFilter || this.gl.NEAREST;
        options.wrapS = options.wrapS || this.gl.CLAMP_TO_EDGE;
        options.wrapT = options.wrapT || this.gl.CLAMP_TO_EDGE;
        options.generateMipmaps = options.generateMipmaps === undefined ? false : options.generateMipmaps;

        var currentFramebuffer = this.bindAndCaptureState();

        this.depthTexture = new PicoGL.Texture(
            this.gl,
            this.appState,
            this.gl.TEXTURE_2D,
            null, 
            this.width, 
            this.height, 
            null,
            false,
            options
        );

        this.gl.framebufferTexture2D(this.gl.DRAW_FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture.texture, 0);

        this.restoreState(currentFramebuffer);
        
        return this;
    };

    /**
        Bind a new texture as a color target.

        @method
        @param {number} index Color attachment to bind the texture to.
        @param {Texture} texture New texture to bind.
    */
    PicoGL.Framebuffer.prototype.replaceTexture = function(index, texture) {
        this.colorTextures[index] = texture;

        var currentFramebuffer = this.bindAndCaptureState();
        this.gl.framebufferTexture2D(this.gl.DRAW_FRAMEBUFFER, this.colorAttachments[index], this.gl.TEXTURE_2D, this.colorTextures[index].texture, 0);
        this.restoreState(currentFramebuffer);
      
        return this;
    };

    /**
        Resize framebuffer to current default drawing buffer
        size. Should be called after calls to App.resize().

        @method
        @param {number} [width=app.width] New width of the framebuffer.
        @param {number} [height=app.height] New height of the framebuffer.
    */
    PicoGL.Framebuffer.prototype.resize = function(width, height) {

        if (width && height) {
            this.width = width;
            this.height = height;
        } else {
            this.width = this.gl.drawingBufferWidth;
            this.height = this.gl.drawingBufferHeight;
        }

        var currentFramebuffer = this.bindAndCaptureState();

        for (var i = 0; i < this.numColorTargets; ++i) {
            this.colorTextures[i].image(null, this.width, this.height);
            this.gl.framebufferTexture2D(this.gl.DRAW_FRAMEBUFFER, this.colorAttachments[i], this.gl.TEXTURE_2D, this.colorTextures[i].texture, 0);
        }

        if (this.depthTexture) {
            this.depthTexture.image(null, this.width, this.height);
            this.gl.framebufferTexture2D(this.gl.DRAW_FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture.texture, 0);
        }

        this.restoreState(currentFramebuffer);
      
        return this;
    };

    /**
        Delete this framebuffer. NOTE: will delete any currently
        attached textures.

        @method
    */
    PicoGL.Framebuffer.prototype.delete = function() {
        for (var i = 0; i < this.numColorTargets; ++i) {
            this.colorTextures[i].delete();
        }

        if (this.depthTexture) {
            this.depthTexture.delete();
        }

        if (this.framebuffer) {
            this.gl.deleteFramebuffer(this.framebuffer);
            this.framebuffer = null;
        }
    };

    // Bind as the draw framebuffer
    PicoGL.Framebuffer.prototype.bindForDraw = function() {
        if (this.appState.drawFramebuffer !== this) {
            this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, this.framebuffer);
            this.appState.drawFramebuffer = this;
        }
    };

    // Bind as the read framebuffer 
    PicoGL.Framebuffer.prototype.bindForRead = function() {
        if (this.appState.readFramebuffer !== this) {
            this.gl.bindFramebuffer(this.gl.READ_FRAMEBUFFER, this.framebuffer);
            this.appState.readFramebuffer = this;
        }
    };

    // Bind for a framebuffer state update.
    // Capture current binding so we can restore it later.
    PicoGL.Framebuffer.prototype.bindAndCaptureState = function() {
        var currentFramebuffer = this.appState.drawFramebuffer;
        
        if (currentFramebuffer !== this) {
            this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, this.framebuffer);
        }

        return currentFramebuffer;
    };

    // Bind restore previous binding after state update
    PicoGL.Framebuffer.prototype.restoreState = function(framebuffer) {        
        if (framebuffer !== this) {
            this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, framebuffer ? framebuffer.framebuffer : null);
        }
    };

})();
;(function() {
    "use strict";

    /**
        A DrawCall represents the program and values of associated
        attributes, uniforms and textures for a single draw call.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {Program} currentProgram The program to use for this draw call.
        @prop {VertexArray} currentVertexArray Vertex array to use for this draw call.
        @prop {TransformFeedback} currentTransformFeedback Transform feedback to use for this draw call.
        @prop {Array} uniformBuffers Ordered list of active uniform buffers.
        @prop {Array} uniformBlockNames Ordered list of uniform block names.
        @prop {Object} uniformBlockBases Map of uniform blocks to uniform buffer bases.
        @prop {Number} uniformBlockCount Number of active uniform blocks for this draw call.
        @prop {Object} uniformIndices Map of uniform names to indices in the uniform arrays.
        @prop {Array} uniformNames Ordered list of uniform names.
        @prop {Array} uniformValue Ordered list of uniform values.
        @prop {number} uniformCount The number of active uniforms for this draw call.
        @prop {Array} textures Array of active textures.
        @prop {number} textureCount The number of active textures for this draw call. 
        @prop {GLEnum} primitive The primitive type being drawn. 
    */
    PicoGL.DrawCall = function DrawCall(gl, program, vertexArray, primitive) {
        this.gl = gl;
        this.currentProgram = program;
        this.currentVertexArray = vertexArray;
        this.currentTransformFeedback = null;    
        
        this.uniformIndices = {};
        this.uniformNames = new Array(PicoGL.WEBGL_INFO.MAX_UNIFORMS);
        this.uniformValues = new Array(PicoGL.WEBGL_INFO.MAX_UNIFORMS);
        this.uniformCount = 0;
        this.uniformBuffers = new Array(PicoGL.WEBGL_INFO.MAX_UNIFORM_BUFFERS);
        this.uniformBlockNames = new Array(PicoGL.WEBGL_INFO.MAX_UNIFORM_BUFFERS);
        this.uniformBlockBases = {};
        this.uniformBlockCount = 0;
        this.samplerIndices = {};
        this.textures = new Array(PicoGL.WEBGL_INFO.MAX_TEXTURE_UNITS);
        this.textureCount = 0;
        this.primitive = primitive !== undefined ? primitive : PicoGL.TRIANGLES;
    };

    PicoGL.DrawCall.prototype.transformFeedback = function(transformFeedback) {
        this.currentTransformFeedback = transformFeedback;    

        return this;
    };

    /**
        Set the value for a uniform. Array uniforms are supported by
        using appending "[0]" to the array name and passing a flat array
        with all required values.

        @method
        @param {string} name Uniform name.
        @param {any} value Uniform value.
    */
    PicoGL.DrawCall.prototype.uniform = function(name, value) {
        var index = this.uniformIndices[name];
        if (index === undefined) {
            index = this.uniformCount++;
            this.uniformIndices[name] = index;
            this.uniformNames[index] = name;
        }
        this.uniformValues[index] = value;

        return this;
    };

    /**
        Set texture to bind to a sampler uniform.

        @method
        @param {string} name Sampler uniform name.
        @param {Texture} texture Texture to bind.
    */
    PicoGL.DrawCall.prototype.texture = function(name, texture) {
        var textureIndex = this.samplerIndices[name];
        if (textureIndex === undefined) {
            textureIndex = this.textureCount++;
            this.samplerIndices[name] = textureIndex;
        }
        
        this.uniform(name, texture.unit);
        this.textures[textureIndex] = texture;
        
        return this;
    };

    /**
        Set uniform buffer to bind to a uniform block.

        @method
        @param {string} name Uniform block name.
        @param {UniformBuffer} buffer Uniform buffer to bind.
    */
    PicoGL.DrawCall.prototype.uniformBlock = function(name, buffer) {
        var base = this.uniformBlockBases[name];
        if (base === undefined) {
            base = this.uniformBlockCount++;
            this.uniformBlockBases[name] = base;
            this.uniformBlockNames[base] = name;
        }
        
        this.uniformBuffers[base] = buffer;
        
        return this;
    };

    // Draw something.
    PicoGL.DrawCall.prototype.draw = function(state) {
        var uniformNames = this.uniformNames;
        var uniformValues = this.uniformValues;
        var uniformBuffers = this.uniformBuffers;
        var uniformBlockNames = this.uniformBlockNames;
        var textures = this.textures;

        if (state.program !== this.currentProgram) {
            this.gl.useProgram(this.currentProgram.program);
            state.program = this.currentProgram;
        }

        for (var uIndex = 0; uIndex < this.uniformCount; ++uIndex) {
            this.currentProgram.uniform(uniformNames[uIndex], uniformValues[uIndex]);
        }

        for (var base = 0; base < this.uniformBlockCount; ++base) {
            this.currentProgram.uniformBlock(uniformBlockNames[base], base);
            uniformBuffers[base].bind(base);
        }

        for (var tIndex = 0; tIndex < this.textureCount; ++tIndex) {
            textures[tIndex].bind();
        }

        if (state.vertexArray !== this.currentVertexArray) {
            this.currentVertexArray.bind();
            state.vertexArray = this.currentVertexArray;
        }

        if (this.currentTransformFeedback) {
            if (state.transformFeedback !== this.currentTransformFeedback) {
                this.currentTransformFeedback.bind();
            }
            this.gl.beginTransformFeedback(this.primitive);
        }

        if (this.currentVertexArray.instanced) {
            if (this.currentVertexArray.indexed) {
                this.gl.drawElementsInstanced(this.primitive, this.currentVertexArray.numElements, this.currentVertexArray.indexType, 0, this.currentVertexArray.numInstances);
            } else {
                this.gl.drawArraysInstanced(this.primitive, 0, this.currentVertexArray.numElements, this.currentVertexArray.numInstances);
            }
        } else {
            if (this.currentVertexArray.indexed) {
                this.gl.drawElements(this.primitive, this.currentVertexArray.numElements, this.currentVertexArray.indexType, 0);
            } else {
                this.gl.drawArrays(this.primitive, 0, this.currentVertexArray.numElements);
            }
        }

        if (this.currentTransformFeedback) {
            this.gl.endTransformFeedback();
            // TODO(Tarek): Need to rebind buffers due to bug in ANGLE.
            // Remove this when that's fixed.
            for (var i = 0, len = this.currentTransformFeedback.angleBugBuffers.length; i < len; ++i) {
                this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, i, null);
            }
        }

    };

})();


;(function() {
    "use strict";

    /**
        Rendering timer.

        @class
        @prop {WebGLRenderingContext} gl The WebGL context.
        @prop {Object} cpuTimer Timer for CPU. Will be window.performance, if available, or window.Date.
        @prop {boolean} gpuTimer Whether the gpu timing is available (EXT_disjoint_timer_query_webgl2 or 
                EXT_disjoint_timer_query are supported).
        @prop {WebGLQuery} gpuTimerQuery Timer query object for GPU (if gpu timing is supported). 
        @prop {boolean} gpuTimerQueryInProgress Whether a gpu timer query is currently in progress.    
        @prop {number} cpuStartTime When the last CPU timing started.
        @prop {number} cpuTime Time spent on the CPU during the last timing. Only valid if App.timerReady() returns true.
        @prop {number} gpuTime Time spent on the GPU during the last timing. Only valid if App.timerReady() returns true.
    */
    PicoGL.Timer = function(gl) {
        this.gl = gl;
        this.cpuTimer = window.performance || window.Date;

        // Note(Tarek): Firefox for some reason only supports EXT_disjoint_timer_query, so have to try both
        var gpuTimerExtension = this.gl.getExtension("EXT_disjoint_timer_query_webgl2") || this.gl.getExtension("EXT_disjoint_timer_query");
        if (gpuTimerExtension) {
            this.gpuTimer = true;
            this.gpuTimerQuery = this.gl.createQuery();
            this.TIME_ELAPSED_EXT = gpuTimerExtension.TIME_ELAPSED_EXT;
            this.GPU_DISJOINT_EXT = gpuTimerExtension.GPU_DISJOINT_EXT;
        } else {
            this.gpuTimer = false;
            this.gpuTimerQuery = null;
            this.TIME_ELAPSED_EXT = null;
            this.GPU_DISJOINT_EXT = null;
        }

        this.gpuTimerQueryInProgress = false;
        this.cpuStartTime = 0;
        this.cpuTime = 0;
        this.gpuTime = 0;
    };

    // Start the rendering timer.
    PicoGL.Timer.prototype.start = function() {
        if (this.gpuTimer) {
            if (!this.gpuTimerQueryInProgress) {
                this.gl.beginQuery(this.TIME_ELAPSED_EXT, this.gpuTimerQuery);
                this.cpuStartTime = this.cpuTimer.now();
            }
        } else {
            this.cpuStartTime = this.cpuTimer.now();
        }
    };

    // Stop the rendering timer.
    PicoGL.Timer.prototype.end = function() {
        if (this.gpuTimer) {
            if (!this.gpuTimerQueryInProgress) {
                this.gl.endQuery(this.TIME_ELAPSED_EXT);
                this.cpuTime = this.cpuTimer.now() - this.cpuStartTime;
                this.gpuTimerQueryInProgress = true;
            }
        } else {
            this.cpuTime = this.cpuTimer.now() - this.cpuStartTime;
        }
    };

    // Check if the rendering time is available. If
    // this method returns true, the cpuTime and
    // gpuTime properties will be set to valid 
    // values.
    PicoGL.Timer.prototype.ready = function() {
        if (this.gpuTimer) {
            if (!this.gpuTimerQueryInProgress) {
                return false;
            }

            var gpuTimerAvailable = this.gl.getQueryParameter(this.gpuTimerQuery, this.gl.QUERY_RESULT_AVAILABLE);
            var gpuTimerDisjoint = this.gl.getParameter(this.GPU_DISJOINT_EXT);

            if (gpuTimerAvailable) {
                this.gpuTimerQueryInProgress = false;
            }

            if (gpuTimerAvailable && !gpuTimerDisjoint) {
                this.gpuTime = this.gl.getQueryParameter(this.gpuTimerQuery, this.gl.QUERY_RESULT)  / 1000000;
                return true;
            } else {
                return false;
            }
        } else {
            return !!this.cpuStartTime;
        }
    };

})();
