import * as THREE from "three";
import Threeasy from "threeasy";

const fragment = `
      uniform float pointCount;
      uniform float progress;

      uniform float w;
      uniform float h;
      varying vec2 vCoordinates;

      uniform sampler2D currentImg;
      uniform sampler2D nextImg;
      varying float delayedProgress;

      void main() {
        vec2 imgUv = vec2(vCoordinates.x/w,vCoordinates.y/h);
        vec4 current = texture2D(currentImg,imgUv);
        vec4 next = texture2D(nextImg,imgUv);
        vec4 image = mix(current, next, delayedProgress);

        gl_FragColor = image;
      }
    `;
const vertex = `
      float PI = 3.1415926535897932384626433;

      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 permute(vec4 x) {
          return mod289(((x*34.0)+1.0)*x);
      }

      vec4 taylorInvSqrt(vec4 r){
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      float snoise(vec3 v) { 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;

        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

        // Permutations
        i = mod289(i); 
        vec4 p = permute( permute( permute( 
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
        //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        // Mix final noise value
        vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }
      uniform vec3 p1v;
      uniform vec3 p1c;
      uniform vec3 p2v;
      uniform vec3 p2c;
      uniform vec3 p3v;
      uniform vec3 p3c;
      uniform vec3 p4v;
      uniform vec3 p4c;
      uniform vec3 p5v;
      uniform vec3 p5c;
      uniform vec3 p6v;
      uniform vec3 p6c;
      uniform vec3 p7v;
      uniform vec3 p7c;
      uniform vec3 p8v;
      uniform vec3 p8c;
      uniform vec3 p9v;
      uniform vec3 p9c;
      uniform vec3 p10v;
      uniform vec3 p10c;
      uniform vec3 p11v;
      uniform vec3 p11c;
      uniform vec3 p12v;
      uniform vec3 p12c;
      uniform vec3 p13v;
      uniform vec3 p13c;
      uniform vec3 p14v;
      uniform vec3 p14c;
      uniform vec3 p15v;
      uniform vec3 p15c;
      uniform vec3 p16v;
      uniform vec3 p16c;
      uniform vec3 p17v;
      uniform vec3 p17c;
      uniform vec3 p18v;
      uniform vec3 p18c;
      uniform vec3 p19v;
      uniform vec3 p19c;
      uniform vec3 p20v;
      uniform vec3 p20c;

      uniform float pointCount;
      uniform float progress;

      uniform float w;
      uniform float h;

      attribute vec3 aCoordinates;
      varying vec2 vCoordinates;
      varying float delayedProgress;

      void main() {
        // voronoi
        float shortest = max(w,h) + 1.;
        vec3 color = vec3(0.,0.,0.);
        vec3 closest = vec3(0.,0.,0.);
        float d = 0.;
        d = distance(p1v,position); if ( d < shortest) { shortest = d; closest = p1v; color = p1c; }
        d = distance(p2v,position); if ( d < shortest) { shortest = d; closest = p2v; color = p2c; }
        d = distance(p3v,position); if ( d < shortest) { shortest = d; closest = p3v; color = p3c; }
        d = distance(p4v,position); if ( d < shortest) { shortest = d; closest = p4v; color = p4c; }
        d = distance(p5v,position); if ( d < shortest) { shortest = d; closest = p5v; color = p5c; }
        d = distance(p6v,position); if ( d < shortest) { shortest = d; closest = p6v; color = p6c; }
        d = distance(p7v,position); if ( d < shortest) { shortest = d; closest = p7v; color = p7c; }
        d = distance(p8v,position); if ( d < shortest) { shortest = d; closest = p8v; color = p8c; }
        d = distance(p9v,position); if ( d < shortest) { shortest = d; closest = p9v; color = p9c; }
        d = distance(p10v,position); if ( d < shortest) { shortest = d; closest = p10v; color = p10c; }
        d = distance(p11v,position); if ( d < shortest) { shortest = d; closest = p11v; color = p11c; }
        d = distance(p12v,position); if ( d < shortest) { shortest = d; closest = p12v; color = p12c; }
        d = distance(p13v,position); if ( d < shortest) { shortest = d; closest = p13v; color = p13c; }
        d = distance(p14v,position); if ( d < shortest) { shortest = d; closest = p14v; color = p14c; }
        d = distance(p15v,position); if ( d < shortest) { shortest = d; closest = p15v; color = p15c; }
        d = distance(p16v,position); if ( d < shortest) { shortest = d; closest = p16v; color = p16c; }
        d = distance(p17v,position); if ( d < shortest) { shortest = d; closest = p17v; color = p17c; }
        d = distance(p18v,position); if ( d < shortest) { shortest = d; closest = p18v; color = p18c; }
        d = distance(p19v,position); if ( d < shortest) { shortest = d; closest = p19v; color = p19c; }
        d = distance(p20v,position); if ( d < shortest) { shortest = d; closest = p20v; color = p20c; }
        
        float xPos = ((aCoordinates.x/w)*2.)-1.;
        vCoordinates = aCoordinates.xy;
        vec3 vMvm = vec3(xPos, aCoordinates.y/h,0.);
        vec3 vPos = position;

        float dir = color.x > .5 ? -1. :1.;

        float progressPerc = progress/100.;
        float lowerBound = color.r *.5;
        float upperBound = 1. - (color.g * .5);
        delayedProgress = smoothstep(lowerBound, upperBound, progressPerc);
        float leverProgress = 1. - abs((delayedProgress -.5)*2.);

        vec3 newPos = position;
        float dst = distance(closest, newPos);

        float a =newPos.y- closest.y;
        float b =newPos.x- closest.x;
        
        float angle =atan(a , b);
        angle += PI*2. * delayedProgress;

        float x = cos(angle) * dst;
        float y = sin(angle) * dst;

        newPos.x = closest.x + x;
        newPos.z = newPos.z + (closest.z + y)*leverProgress + (500. * leverProgress * dir);

        vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.);
        gl_PointSize = 2000.*(1./-mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
const img1 = "/textures/stair1.jpeg"; // https://unsplash.com/photos/w6OniVDCfn0
const img2 = "/textures/stair2.jpeg"; // https://unsplash.com/photos/cfQEO_1S0Rs
const img3 = "/textures/stair3.jpeg"; // https://unsplash.com/photos/tb4heMa-ZRo

// SETTINGS
let textures, geo, w, h, mat, mesh, particleCount, positions, coordinates;
let progress = { progress: 0 };
let active = 0;
let pointCount = 20;
let colorsBG = ["#ddf4f0", "#e4e2ee", "#cbdac3"];
let colorsText = ["#8a3738", "#840c02", "#444"];

function randomVoronoiVector() {
	return new THREE.Vector3(
		Math.round(w * Math.random() - w * 0.5),
		Math.round(h * Math.random() - h * 0.5),
		0
	);
}
function random3DVector() {
	return new THREE.Vector3(Math.random(), Math.random(), Math.random());
}
function random3DDirectionalVector() {
	let v = new THREE.Vector3(
		Math.random() * 30 * Math.random() < 0.5 ? 1 : -1,
		Math.random() * 30 * Math.random() < 0.5 ? 1 : -1,
		Math.random()
	);
	return v;
}
function moveVoronoiVectors() {
	for (let i = 1; i <= 20; i++) {
		let item = mesh.material.uniforms[`p${i}v`].value;
		let acc = mesh.material.uniforms[`p${i}a`].value;

		item.x += acc.x;
		item.y += acc.y;

		if (item.x <= -w / 2) {
			item.x = -w / 2;
			acc.x *= -1;
		}
		if (item.x >= w / 2) {
			item.x = w / 2;
			acc.x *= -1;
		}
		if (item.y <= -h / 2) {
			item.y = -h / 2;
			acc.y *= -1;
		}
		if (item.y >= h / 2) {
			item.y = h / 2;
			acc.y *= -1;
		}
	}
}

document.body.style.backgroundColor = colorsBG[0];
document.body.style.color = colorsText[0];

const app = new Threeasy(THREE, {
	preload: {
		img1,
		img2,
		img3,
	},
	alpha: true,
});
console.log(app.renderer);

app.camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	6000
);
app.camera.position.x = 0;
app.camera.position.y = 0;
app.camera.position.z = 1000;

let ambLight = new THREE.AmbientLight(0xffffff, 0.7, 100);
app.scene.add(ambLight);

let dirLight = new THREE.DirectionalLight(0xffffff, 1, 100);
dirLight.position.set(-3, 5, -3);
app.scene.add(dirLight);

app.postload(() => {
	textures = [app.img1, app.img2, app.img3];
	geo = new THREE.BufferGeometry();
	w = textures[1].image.naturalWidth;
	h = textures[1].image.naturalHeight;
	particleCount = w * h;

	positions = new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3);
	coordinates = new THREE.BufferAttribute(
		new Float32Array(particleCount * 3),
		3
	);

	let index = 0;
	for (let i = 0; i < w; i++) {
		for (let j = 0; j < h; j++) {
			positions.setXYZ(index, i - w / 2, j - h / 2, 0);
			coordinates.setXYZ(index, i, j, 0);
			index++;
		}
	}
	geo.setAttribute("position", positions);
	geo.setAttribute("aCoordinates", coordinates);

	mat = new THREE.ShaderMaterial({
		side: THREE.DoubleSide,
		transparent: true,
		depthTest: false,
		depthWrite: false,
		uniforms: {
			progress: { value: progress.progress },
			w: { value: w },
			h: { value: h },
			pointCount: { value: pointCount },
			currentImg: { value: textures[active % 3] },
			nextImg: { value: textures[(active + 1) % 3] },
		},
		vertexShader: vertex,
		fragmentShader: fragment,
	});
	for (let i = 1; i <= 20; i++) {
		mat.uniforms[`p${i}v`] = { value: randomVoronoiVector() };
		mat.uniforms[`p${i}c`] = { value: random3DVector() };
		mat.uniforms[`p${i}a`] = { value: random3DDirectionalVector() };
	}
	mesh = new THREE.Points(geo, mat);
	app.scene.add(mesh);

	app.animate(() => {
		moveVoronoiVectors();
		mesh.material.uniforms.progress.value = progress.progress;
	});
});

function choose(current, next) {
	current = current % 3;
	next = next % 3;
	mesh.material.uniforms.currentImg.value = textures[current];
	mesh.material.uniforms.nextImg.value = textures[next];
	gsap.fromTo(
		progress,
		{ progress: 0 },
		{ progress: 100, duration: 2, ease: "power1.inOut" }
	);
	gsap.to("body", {
		backgroundColor: colorsBG[next],
		color: colorsText[next],
		duration: 1.5,
		delay: 1,
		ease: "power4.inOut",
	});
}
function choosePrev() {
	let current = active;
	let next;
	if (active == 0) active = 3;
	active--;
	next = active;
	choose(current, next);
}
function chooseNext() {
	let current = active;
	let next;
	active++;
	next = active;

	choose(current, next);
}

document.querySelector(".prev").addEventListener("click", () => {
	choosePrev();
});
document.querySelector(".next").addEventListener("click", () => {
	chooseNext();
});
