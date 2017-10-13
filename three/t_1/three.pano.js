var controls, lastTime;

!function(a) {
    a.panorama = function(a) {
        this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 20000), 
        this.scene = new THREE.Scene(), this.target = new THREE.Vector3(), this.renderer = null, 
        this.stageWidth = a.stageWidth || window.innerWidth, this.stageHeight = a.stageHeight || window.innerHeight, 
        this.dragDom = this.dragDom || document, this.images = a.images || [], this.lon = 0, 
        this.lat = 0, this.lon1 = 0, this.lat1 = 0, this.phi = 0, this.theta = 0, this.lastLon = a.initLon || 0, 
        this.lastLat = 0, this.mouse = {}, this.curOrient = {
            alpha:0,
            beta:0,
            gamma:0
        }, this.targetOrient = {
            alpha:0,
            beta:0,
            gamma:0
        }, this.lockLat = !1, this.autoSpeed = .1, this.elements = [], this.warp = a.warp || document.body, 
        this.pause = !1, this.renderType = a.renderType || "img", this.renderElements = a.renderElements || [], 
        this.autoResize = a.autoResize, this.androidDeviceSupport = void 0 === a.androidDeviceSupport ? !0 :a.androidDeviceSupport, 
        this.isAndroid = /android/gi.test(navigator.userAgent.toLowerCase());
    }, a.panorama.prototype = {
        initCss3d:function() {
            var a, b, c, d;
            for (this.sides = [ {
                url:this.images[0],
                position:[ -512, 0, 0 ],
                rotation:[ 0, Math.PI / 2, 0 ]
            }, {
                url:this.images[1],
                position:[ 512, 0, 0 ],
                rotation:[ 0, -Math.PI / 2, 0 ]
            }, {
                url:this.images[2],
                position:[ 0, 512, 0 ],
                rotation:[ Math.PI / 2, 0, Math.PI ]
            }, {
                url:this.images[3],
                position:[ 0, -512, 0 ],
                rotation:[ -Math.PI / 2, 0, Math.PI ]
            }, {
                url:this.images[4],
                position:[ 0, 0, 512 ],
                rotation:[ 0, Math.PI, 0 ]
            }, {
                url:this.images[5],
                position:[ 0, 0, -512 ],
                rotation:[ 0, 0, 0 ]
            } ], a = 0; a < this.sides.length; a++) b = this.sides[a], "img" === this.renderType ? (c = document.createElement("img"), 
            c.width = 1024, c.src = b.url) :c = this.renderElements[a], this.elements.push(c), 
            d = new THREE.CSS3DObject(c), d.position.fromArray(b.position), d.rotation.fromArray(b.rotation), 
            this.scene.add(d);
            this.renderer = new THREE.CSS3DRenderer(), this.renderer.setSize(this.stageWidth, this.stageHeight), 
            this.warp.appendChild(this.renderer.domElement), "undefined" == typeof this.autoResize && (this.autoResize = !0), 
            this.handelResize();
        },
        render:function(a, b) {
            this.lon = a, this.lat = b, this.phi = THREE.Math.degToRad(90 - this.lat), this.theta = THREE.Math.degToRad(this.lon), 
            this.target.x = Math.sin(this.phi) * Math.cos(this.theta), this.target.y = Math.cos(this.phi), 
            this.target.z = Math.sin(this.phi) * Math.sin(this.theta), this.camera.lookAt(this.target), 
            this.renderer.render(this.scene, this.camera), this.onMove(this.lon, this.lat);
        },
        renderPc:function() {
            var a = this;
            !function b() {
                requestAnimationFrame(b), a.pause || (a.lastLon += a.autoSpeed, a.lastLat = Math.max(-85, Math.min(85, a.lastLat)), 
                a.render(a.lastLon, a.lastLat));
            }();
        },
        onMove:function() {},
        renderMobile:function() {
            var a = this,i=0;
            !function b() {
                var c, d;
                requestAnimationFrame(b), a.pause || (a.isAndroid || (a.lastLon += a.autoSpeed), 
                a.curOrient.alpha += .05 * (a.targetOrient.alpha - a.curOrient.alpha), a.curOrient.beta += .05 * (a.targetOrient.beta - a.curOrient.beta), 
                c = a.lastLon - a.curOrient.alpha, d = a.lastLat, a.lockLat || 
                (//d = a.lastLat + a.curOrient.beta,//加载完改变经度（晃动）
                d = Math.max(-85, Math.min(85, d))),
                a.render(c, d))
                // console.log(++i)
            }();
        },
        initDomEvent:function() {
            function b(b) {
                if (!e.pause) {
                    var b = window.event || b;
                    "ontouchstart" in window ? (e.mouse.x = b.touches[0].clientX, e.mouse.y = b.touches[0].clientY) :(e.mouse.x = b.clientX, 
                    e.mouse.y = b.clientY), e.lon1 = e.lastLon, e.lat1 = e.lastLat, e.dragDom.addEventListener("mousemove", c, !1), 
                    e.dragDom.addEventListener("mouseup", d, !1), e.dragDom.addEventListener("touchmove", c, !1), 
                    e.dragDom.addEventListener("touchend", d, !1), b.preventDefault(), a = {
                        c:e.lon1,
                        d:e.lat1
                    };
                }
            }
            function c(b) {
                var c, d;
                b = window.event || b, "ontouchstart" in window ? (c = b.touches[0].clientX - e.mouse.x, 
                d = b.touches[0].clientY - e.mouse.y) :(c = b.clientX - e.mouse.x, d = b.clientY - e.mouse.y);
                TweenLite.killTweensOf(a), TweenLite.to(a, .5, {
                    c:e.lon1 - .1 * c,
                    d:e.lat1 + .1 * d,
                    onUpdate:function() {
                        e.lastLon = a.c, e.lockLat || (e.lastLat = a.d);
                    }
                }), b.preventDefault();
            }
            function d() {
                e.dragDom.removeEventListener("mousemove", c, !1), e.dragDom.removeEventListener("mouseup", d, !1), 
                e.dragDom.removeEventListener("touchmove", c, !1), e.dragDom.removeEventListener("touchend", d, !1);
            }
            var a, e = this;
            this.dragDom.addEventListener("mousedown", b, !1), this.dragDom.addEventListener("touchstart", b, !1);
        },
        initDevice:function() {
            function a(a) {
                var c, d = 0;
                d = Math.abs(a.gamma) < 90 ? a.beta - 90 :90 - a.beta, b.targetOrient.beta = Math.floor(d), 
                c = a.alpha + a.gamma, Math.abs(b.targetOrient.alpha - c) > 180 ? (b.targetOrient.alpha <= c ? b.curOrient.alpha += 360 :b.targetOrient.alpha = b.curOrient.alpha -= 360, 
                b.targetOrient.alpha = Math.floor(c)) :b.targetOrient.alpha = Math.floor(c);
            }
            var b = this;
            window.DeviceMotionEvent && (b.isAndroid ? b.androidDeviceSupport && window.addEventListener("deviceorientation", a, !1) :window.addEventListener("deviceorientation", a, !1));
        },
        handelResize:function() {
            var a = this;
            a.autoResize && window.addEventListener("resize", function() {
                a.camera.aspect = window.innerWidth / window.innerHeight, a.camera.updateProjectionMatrix(), 
                a.renderer.setSize(window.innerWidth, window.innerHeight);
            }, !1);
        },
        setElements:function(b) {
            var c, d, e, f, g;
            if (b.length && a.tool.isArray(b)) if ("img" === this.renderType) for (this.reset(), 
            c = 0; c < b.length; c++) this.elements[c].src = b[c]; else {
                for (this.renderElements = b, c = 0, d = this.scene.children.length; d > c; c++) this.scene.remove(this.scene.children[0]);
                for (c = 0; c < b.length; c++) e = this.sides[c], f = this.renderElements[c], this.elements.push(f), 
                g = new THREE.CSS3DObject(f), g.position.fromArray(e.position), g.rotation.fromArray(e.rotation), 
                this.scene.add(g);
            }
        },
        reset:function() {
            this.lon = 0, this.lat = 0, this.lon1 = 0, this.lat1 = 0, this.phi = 0, this.theta = 0, 
            this.lastLon = 0, this.lastLat = 0;
        },
        stop:function() {
            this.pause = !0;
        },
        play:function() {
            this.pause = !1;
        }
    };
}(THREE);