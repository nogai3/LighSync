let scene, camera, renderer, avatar;
let currentAnimation = null;
let animationStartTime = 0;
console.log("Putin");
// JSON для анимации прыжка
const jumpAnimation = {
    name: "jump",
    duration: 1,
    bones: {
        avatar: [
            { time: 0, position: [0, 0, 0] },
            { time: 0.5, position: [0, 1, 0] },
            { time: 1, position: [0, 0, 0] }
        ]
    }
};

// JSON для шапок (добавим больше стилей)
const hatModels = {
    wizard: {
        geometry: "cone",
        size: [0.7, 1, 32],
        position: [0, 2.5, 0],
        color: 0x800080
    },
    cap: {
        geometry: "sphere",
        size: [0.6, 32, 32, 0, Math.PI],
        position: [0, 2.2, 0],
        color: 0x0000ff
    },
    topHat: {
        geometry: "cylinder",
        size: [0.5, 0.8, 0.5, 32],
        position: [0, 2.4, 0],
        color: 0x000000
    }
};

// API для управления аватаром
const AvatarAPI = {
    hat: null,
    face: null,
    eyes: null,
    mouth: null,

    addHatElement(hatType) {
        if (this.hat) {
            avatar.remove(this.hat);
        }
        if (hatType !== 'none') {
            const hatData = hatModels[hatType];
            let hatGeometry;
            if (hatData.geometry === 'cone') {
                hatGeometry = new THREE.ConeGeometry(...hatData.size);
            } else if (hatData.geometry === 'sphere') {
                hatGeometry = new THREE.SphereGeometry(...hatData.size);
            } else if (hatData.geometry === 'cylinder') {
                hatGeometry = sarannoew.THREE.CylinderGeometry(...hatData.size);
            }
            this.hat = new THREE.Mesh(hatGeometry, new THREE.MeshBasicMaterial({ color: hatData.color }));
            this.hat.position.set(...hatData.position);
            avatar.add(this.hat);
        }
        playAnimation(Date.now() / 1000, jumpAnimation);
    },

    addFaceElement(faceType) {
        const head = avatar.children.find(child => child.name === 'head');
        if (this.face) {
            head.material.map = null;
            this.face = null;
        }
        if (faceType === 'default') {
            // Здесь можно добавить текстуру лица
            const texture = new THREE.TextureLoader().load('assets/models/textures/face.png');
            head.material.map = texture;
        }
        playAnimation(Date.now() / 1000, jumpAnimation);
    },

    addEyesElement(eyesType) {
        const head = avatar.children.find(child => child.name === 'head');
        if (eyesType === 'default') {
            // Здесь можно добавить текстуру глаз (накладываем на переднюю грань головы)
            // Для примера просто меняем цвет
            head.material.color.set(0xffdbac);
        }
        playAnimation(Date.now() / 1000, jumpAnimation);
    },

    addMouthElement(mouthType) {
        const head = avatar.children.find(child => child.name === 'head');
        if (mouthType === 'default') {
            // Здесь можно добавить текстуру рта
            head.material.color.set(0xffdbac);
        }
        playAnimation(Date.now() / 1000, jumpAnimation);
    },

    addShirt(color) {
        const body = avatar.children.find(child => child.name === 'body');
        body.material.color.set(parseInt(color.replace('#', '0x'), 16));
        playAnimation(Date.now() / 1000, jumpAnimation);
    },

    addPants(color) {
        const legs = avatar.children.filter(child => child.name.includes('Leg'));
        legs.forEach(leg => {
            leg.material.color.set(parseInt(color.replace('#', '0x'), 16));
        });
        playAnimation(Date.now() / 1000, jumpAnimation);
    }
};

function init() {
    // Создаем сцену
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(400, 400);
    document.getElementById('avatarCanvas').appendChild(renderer.domElement);

    // Начальная позиция камеры
    camera.position.set(0, 0, 5);

    // Добавляем свет
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Создаем аватар (блочная модель с пропорциями Mojavatar)
    avatar = new THREE.Group();

    // Голова (8x8x8 вокселей, масштабируем для Three.js)
    const headGeometry = new THREE.BoxGeometry(1, 1, 1); // 8x8x8 в воксельной системе
    const headMaterial = new THREE.MeshBasicMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    head.name = 'head';
    avatar.add(head);

    // Тело (8x12x4 вокселя)
    const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5); // 8x12x4
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.name = 'body';
    avatar.add(body);

    // Руки (4x12x4 вокселя)
    const armGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5); // 4x12x4
    const leftArm = new THREE.Mesh(armGeometry, new THREE.MeshBasicMaterial({ color: 0xffdbac }));
    leftArm.position.set(-0.75, 0.75, 0); // Смещаем влево
    leftArm.name = 'leftArm';
    avatar.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, new THREE.MeshBasicMaterial({ color: 0xffdbac }));
    rightArm.position.set(0.75, 0.75, 0); // Смещаем вправо
    rightArm.name = 'rightArm';
    avatar.add(rightArm);

    // Ноги (4x12x4 вокселя)
    const legGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5); // 4x12x4
    const leftLeg = new THREE.Mesh(legGeometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    leftLeg.position.set(-0.25, -0.75, 0); // Смещаем влево
    leftLeg.name = 'leftLeg';
    avatar.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    rightLeg.position.set(0.25, -0.75, 0); // Смещаем вправо
    rightLeg.name = 'rightLeg';
    avatar.add(rightLeg);

    scene.add(avatar);

    // Начальная анимация
    animate();
}

function updateCamera() {
    const x = parseFloat(document.getElementById('cameraX').value);
    const y = parseFloat(document.getElementById('cameraY').value);
    const z = parseFloat(document.getElementById('cameraZ').value);
    camera.position.set(x, y, z);
}

function updateHat(hatType) {
    AvatarAPI.addHatElement(hatType);
}

function updateFace(faceType) {
    AvatarAPI.addFaceElement(faceType);
}

function updateEyes(eyesType) {
    AvatarAPI.addEyesElement(eyesType);
}

function updateMouth(mouthType) {
    AvatarAPI.addMouthElement(mouthType);
}

function updateShirt(color) {
    AvatarAPI.addShirt(color);
}

function updatePants(color) {
    AvatarAPI.addPants(color);
}

function updateBackground() {
    const bgColor = document.getElementById('bgColor').value;
    document.getElementById('avatarCanvas').style.backgroundColor = bgColor;
}

function playAnimation(time, jsonBoneLink) {
    currentAnimation = jsonBoneLink;
    animationStartTime = time;
}

function downloadAvatar() {
    const canvas = renderer.domElement;
    html2canvas(canvas).then(canvas => {
        const link = document.createElement('a');
        link.download = 'mojavatar.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

function openTab(tabName) {
    const tabs = document.getElementsByClassName('tab-content');
    const buttons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
        buttons[i].classList.remove('active');
    }
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add('active');
}

function animate() {
    requestAnimationFrame(animate);

    // Вращение аватара
    avatar.rotation.y += 0.01;

    // Воспроизведение анимации прыжка
    if (currentAnimation) {
        const elapsedTime = (Date.now() / 1000 - animationStartTime) % currentAnimation.duration;
        for (let bone in currentAnimation.bones) {
            const boneData = currentAnimation.bones[bone];
            const target = bone === 'avatar' ? avatar : avatar.children.find(child => child.name === bone);

            if (target) {
                let startFrame, endFrame;
                for (let i = 0; i < boneData.length - 1; i++) {
                    if (elapsedTime >= boneData[i].time && elapsedTime <= boneData[i + 1].time) {
                        startFrame = boneData[i];
                        endFrame = boneData[i + 1];
                        break;
                    }
                }

                if (startFrame && endFrame) {
                    const t = (elapsedTime - startFrame.time) / (endFrame.time - startFrame.time);
                    const posX = startFrame.position[0] + (endFrame.position[0] - startFrame.position[0]) * t;
                    const posY = startFrame.position[1] + (endFrame.position[1] - startFrame.position[1]) * t;
                    const posZ = startFrame.position[2] + (endFrame.position[2] - startFrame.position[2]) * t;
                    target.position.set(posX, posY + 1.5, posZ); // 1.5 для смещения
                }
            }
        }
    }

    renderer.render(scene, camera);
}

// Инициализация сцены
init();