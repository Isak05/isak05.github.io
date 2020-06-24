// Three
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = "YXZ";

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
c.id = "overlay";
document.body.appendChild(c);
var ctx = c.getContext("2d");

// Ammo
Ammo().then(onAmmoStart);

function onAmmoStart() {
	var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
	var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
	var overlappingPairCache = new Ammo.btDbvtBroadphase();
	var solver = new Ammo.btSequentialImpulseConstraintSolver();
	window.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
	physicsWorld.setGravity(new Ammo.btVector3(0, -9.80665, 0));
	window.tempTransform = new Ammo.btTransform();
	
	player.init();
	
	window.otherPlayers = [];
	for(var i = 0; i < 3; i++) {
		otherPlayers.push({
			posAnim1: {x: 0, y: 0, z: 0}, 
			posAnim2: {x: 0, y: 0, z: 0}
		});
		otherPlayers[i].model = createObject({
			shape: Shape.CYLINDER,
			scale: {x: 0.5, y: 1.8, z: 0.5}
		});
	}
	
	var texture = loadTexture("img.png");
	loadModel("untitled.obj", (geometry) => {
		createObject({
			pos: {x: -5, y: 1, z: 0}, 
			scale: {x: 1, y: 1, z: 1},
			customGeometry: geometry,
			shape: Shape.CUSTOM, 
			texture: texture
		});
	});
	
	var treeTexture = loadTexture("tree.png");
	loadModel("tree.obj", (geometry) => {
		createObject({
			pos: {x: -1, y: 0, z: -9}, 
			scale: {x: 3, y: 3, z: 3},
			customGeometry: geometry,
			shape: Shape.CUSTOM, 
			texture: treeTexture
		});
	});
	
	loadModel("chair.obj", (geometry) => {
		var chair = createObject({
			pos: {x: 8, y: 4, z: -2}, 
			rot: {x: 0, y: -1, z: 0},
			scale: {x: 0.5, y: 0.5, z: 0.5},
			customGeometry: geometry,
			shape: Shape.CUSTOM, 
			color: "rgb(255, 175, 75)"
		});
		chair.userData.rigidBody = createRigidBody({
			pos: {x: 8, y: 0, z: -2}, 
			rot: {x: 0, y: -1, z: 0}, 
			scale: {x: 1, y: 2.25, z: 1},
			offset: {x: 0, y: -1.125, z: 0}, 
			mass: 10,
			friction: 1.5,
			shape: Shape.CUBOID
		});
		chair.userData.interact = function() {
			player.sit(chair, 2.5);
		}
		
		/*var hingeConstraint = new Ammo.btHingeConstraint(
			rigidBodies[44],
			rigidBodies[0],
			new Ammo.btVector3(0, -1.3, 0),
			new Ammo.btVector3(8, 0.5, 0),
			new Ammo.btVector3(0, 1, 0),
			new Ammo.btVector3(0, 1, 0),
			false
		);*/
		//physicsWorld.addConstraint(hingeConstraint, false);
	});
	/*createRigidBodyObject({
		mass: 0,
		pos: {x: 8, y: 1.5, z: 4}, 
		scale: {x: 0.05, y: 3, z: 1.5},
	});*/
	var doorTexture = loadTexture("door.png");
	loadModel("door.obj", (geometry) => {
		var door = createObject({
			pos: {x: 8, y: 0, z: 4}, 
			rot: {x: 0, y: 0, z: 0},
			scale: {x: 1.5, y: 1.5, z: 1.5},
			customGeometry: geometry,
			shape: Shape.CUSTOM, 
			texture: doorTexture
		});
		door.userData.rigidBody = createRigidBody({
			mass: 100,
			pos: {x: 8, y: 1.5, z: 4}, 
			scale: {x: 0.05, y: 3, z: 1.5},
			offset: {x: 0, y: -1.5, z: 0}
		});
		door.userData.interact = function() {
			//player.sit(chair, 2.5);
			door.userData.rigidBody.setAngularVelocity(new Ammo.btVector3(0, 5, 0));
		}
		
		var hingeConstraint = new Ammo.btHingeConstraint(
			rigidBodies[45],
			rigidBodies[0],
			new Ammo.btVector3(0, -1.5, -0.75),
			new Ammo.btVector3(8, 0.5, 4),
			new Ammo.btVector3(0, 1, 0),
			new Ammo.btVector3(0, 1, 0),
			false
		);
		physicsWorld.addConstraint(hingeConstraint, false);
	});
	
	createRigidBodyObject({
		pos: {x: 0, y: -0.5, z: 0}, 
		scale: {x: 50, y: 1, z: 50},  
		mass: 0, 
		restitution: 0.3, 
		color: "rgb(220, 220, 220)", 
		shape: Shape.CUBOID,
		friction: 0.75
	});
	createRigidBodyObject({
		pos: {x: 1, y: 20, z: 2}, 
		scale: {x: 3, y: 1, z: 2},  
		mass: 6000, 
		restitution: 0.4, 
		shape: Shape.CUBOID,
		texture: texture
	});
	createRigidBodyObject({
		pos: {x: 0.75, y: 3, z: 2.125}, 
		radius: 1,
		mass: 4000, 
		restitution: 0.9, 
		color: "rgb(255, 0, 0)", 
		shape: Shape.SPHERE
	});
	createRigidBodyObject({
		pos: {x: 2, y: 2, z: 0}, 
		scale: {x: 1, y: 3, z: 1},
		mass: 2000, 
		restitution: 0.9, 
		color: "rgb(0, 255, 0)", 
		shape: Shape.CYLINDER
	});
	createRigidBody({
		pos: {x: -5, y: 2.5, z: 4}, 
		scale: {x: 2, y: 5, z: 2},
		mass: 0, 
		shape: Shape.CUBOID
	});
	createRigidBody({
		pos: {x: -5, y: 2.5, z: -4.6}, 
		scale: {x: 2, y: 5, z: 2},
		mass: 0, 
		shape: Shape.CUBOID
	});
	createRigidBodyObject({
		pos: {x: 25, y: 1.25, z: 0}, 
		scale: {x: 1, y: 2.5, z: 50},
		mass: 0, 
		restitution: 1, 
		color: "rgb(0, 255, 255)", 
		shape: Shape.CUBOID
	});
	createRigidBodyObject({
		pos: {x: -25, y: 1.25, z: 0}, 
		scale: {x: 1, y: 2.5, z: 50},
		mass: 0, 
		restitution: 1, 
		color: "rgb(0, 255, 255)", 
		shape: Shape.CUBOID
	});
	createRigidBodyObject({
		pos: {x: 0, y: 1.25, z: 25}, 
		scale: {x: 50, y: 2.5, z: 1},
		mass: 0, 
		restitution: 1, 
		color: "rgb(0, 255, 255)", 
		shape: Shape.CUBOID
	});
	createRigidBodyObject({
		pos: {x: 0, y: 1.25, z: -25}, 
		scale: {x: 50, y: 2.5, z: 1},
		mass: 0, 
		restitution: 1, 
		color: "rgb(0, 255, 255)", 
		shape: Shape.CUBOID
	});
	createRigidBody({
		pos: {x: -1, y: 2.5, z: -9}, 
		scale: {x: 0.8, y: 5, z: 0.8},
		mass: 0, 
		shape: Shape.CYLINDER
	});
	
	var stone = loadTexture("stone.png");
	var layerAmount = 5.5
	for(var i = 0; i < 33; i++) {
		createRigidBodyObject({
			pos: {x: i % layerAmount + 4, y: Math.floor(i / layerAmount) + 0.5, z: -10}, 
			mass: 5, 
			texture: stone
		});
	}
	
	animate();
}

//// TEST
/*var light = new THREE.SpotLight("rgb(255, 255, 200)", 1, 50, Math.PI * 0.175, 0.5, 1);
light.position.set(0, 10, 0);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
scene.add(light);*/
var light2 = new THREE.DirectionalLight("rgb(255, 255, 240)");
light2.position.set(20, 20, 10);
light2.castShadow = true;
light2.shadow.mapSize.width = 2048;
light2.shadow.mapSize.height = 2048;
light2.shadow.camera.left = -15;
light2.shadow.camera.right = 15;
light2.shadow.camera.top = 15;
light2.shadow.camera.bottom = -15;
scene.add(light2);

var ambient = new THREE.AmbientLight("rgb(20, 20, 40)");
scene.add(ambient);

var textureLoader = new THREE.TextureLoader();
var objLoader = new THREE.OBJLoader();

var mouse = {
	pos: {x: 0, y: 0},
	vel: {x: 0, y: 0},
	sensitivity: 1,
	keys: []
};
for(var i = 0; i < 10; i++) {
	mouse.keys.push(false);
}

var player = {
	pos: {x: 0, y: 1.7, z: 0},
	rot: {x: 0, y: 0},
	mass: 70,
	onGround: false,
	sinceLastJump: 0,
	grabForce: 10,
	grabbedRigidBody: null,
	grabLength: 2.5, 
	maxGrabLength: 5,
	maxGrabMass: 5000,
	seat: null,
	speed: {
		forward: 10,
		backward: 5,
		strafe: 7.5
	},
	update: function() {
		this.rot.y += -mouse.vel.x * mouse.sensitivity * 0.005;
		this.rot.x += -mouse.vel.y * mouse.sensitivity * 0.005;
		this.rot.x = Math.max(Math.min(this.rot.x, Math.PI * 0.5), -Math.PI * 0.5);
		
		this.sinceLastJump += delta;
		
		this.onGround = false;
		var raycaster = new THREE.Raycaster(new THREE.Vector3(this.pos.x, this.pos.y - 1.79, this.pos.z), new THREE.Vector3(0, -1, 0));
		var intersects = raycaster.intersectObjects(scene.children);
		if(intersects.length > 0 && this.sinceLastJump > 0.005) {
			if(intersects[0].distance < 0.1) {
				this.onGround = true;
			}
		}
		
		var impulse = {x: 0, y: 0, z: 0};
		if(keys[87]) {
			impulse.x -= Math.sin(this.rot.y) * this.speed.forward;
			impulse.z -= Math.cos(this.rot.y) * this.speed.forward;
		}
		if(keys[83]) {
			impulse.x += Math.sin(this.rot.y) * this.speed.backward;
			impulse.z += Math.cos(this.rot.y) * this.speed.backward;
		}
		if(keys[65]) {
			impulse.x += Math.sin(this.rot.y - Math.PI * 0.5) * this.speed.strafe;
			impulse.z += Math.cos(this.rot.y - Math.PI * 0.5) * this.speed.strafe;
		}
		if(keys[68]) {
			impulse.x += Math.sin(this.rot.y + Math.PI * 0.5) * this.speed.strafe;
			impulse.z += Math.cos(this.rot.y + Math.PI * 0.5) * this.speed.strafe;
		}
		if(keys[32]) {
			if(this.onGround) {
				impulse.y += 15;
				this.sinceLastJump = 0;
			}
			if(this.seat != null) {
				this.unsit(this.seat);
			}
		}
		if(mouse.keys[0]) {
			var cameraDir = new THREE.Vector3();
			camera.getWorldDirection(cameraDir)
			if(this.grabbedRigidBody == null) {
				var ray = new THREE.Raycaster(camera.position, cameraDir);
				var intersects = ray.intersectObjects(scene.children);
				if(intersects.length > 0) {
					var obj = intersects[0].object;
					if(obj.userData.rigidBody != undefined && intersects[0].distance < this.maxGrabLength) {
						if(obj.userData.rigidBody.mass <= this.maxGrabMass && obj.userData.rigidBody.mass != 0) {
							this.grabbedRigidBody = obj.userData.rigidBody;
						}
					}
				}
			} else {
				var target = {
					x: camera.position.x + cameraDir.x * this.grabLength,
					y: camera.position.y + cameraDir.y * this.grabLength,
					z: camera.position.z + cameraDir.z * this.grabLength
				};
				var pos;
				var motionState = this.grabbedRigidBody.getMotionState();
				if(motionState) {
					motionState.getWorldTransform(tempTransform);
					pos = tempTransform.getOrigin();
				}
				this.grabbedRigidBody.activate();
				this.grabbedRigidBody.setLinearVelocity(new Ammo.btVector3(
					(target.x - pos.x()) * this.grabForce, 
					(target.y - pos.y()) * this.grabForce, 
					(target.z - pos.z()) * this.grabForce
				));
			}
		} else {
			this.grabbedRigidBody = null;
		}
		if(keys[69]) {
			var cameraDir = new THREE.Vector3();
			camera.getWorldDirection(cameraDir);
			var ray = new THREE.Raycaster(camera.position, cameraDir);
			var intersects = ray.intersectObjects(scene.children);
			if(intersects.length > 0) {
				var obj = intersects[0].object;
				if(obj.userData.interact != undefined) {
					obj.userData.interact();
				}
			}
		}
		
		this.rigidBody.activate();
		var curVel = this.rigidBody.getLinearVelocity();
		this.rigidBody.setLinearVelocity(new Ammo.btVector3(impulse.x, impulse.y + curVel.y(), impulse.z));
		
		camera.rotation.y = this.rot.y;
		camera.rotation.x = this.rot.x;
		
		camera.position.set(this.pos.x, this.pos.y, this.pos.z);
		
		mouse.vel.x = 0;
		mouse.vel.y = 0;
	}, 
	init: function() {
		var transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(this.pos.x, this.pos.y - 0.9, this.pos.z));
		
		var motionState = new Ammo.btDefaultMotionState(transform);
		var shape = new Ammo.btCylinderShape(new Ammo.btVector3(0.5, 1.8, 0.5))
		shape.setMargin( 0.05 );

		var localInertia = new Ammo.btVector3(0, 0, 0);
		shape.calculateLocalInertia(this.mass, localInertia);

		var rbInfo = new Ammo.btRigidBodyConstructionInfo(this.mass, motionState, shape, localInertia);
		this.rigidBody = new Ammo.btRigidBody(rbInfo);
		this.rigidBody.setRestitution(0);
		this.rigidBody.setAngularFactor(new Ammo.btVector3(0, 0, 0));
		
		physicsWorld.addRigidBody(this.rigidBody);
		
		this.rigidBody.setGravity(new Ammo.btVector3(0, -30, 0));
	}, 
	sit: function(seat, yOffset) {
		if(this.seat != null) {
			this.unsit(this.seat);
		}
			
		this.seat = seat;
		
		setTimeout(function(){
			seat.rotateX(-Math.PI * 0.5);
			var seatDir = new THREE.Vector3();
			seat.getWorldDirection(seatDir);
			seat.rotateX(Math.PI * 0.5);
			// Player 
			var transform = player.rigidBody.getCenterOfMassTransform();
			transform.setOrigin(new Ammo.btVector3(
				seat.position.x + yOffset * seatDir.x, 
				seat.position.y + yOffset * seatDir.y, 
				seat.position.z + yOffset * seatDir.z
			));
				
			player.rigidBody.setCenterOfMassTransform(transform);
			physicsWorld.stepSimulation(0, 1);
			player.rigidBody.setMassProps(0);
			
			// Seat
			var body = seat.userData.rigidBody;
			body.setMassProps(0);
		}, 1);
	}, 
	unsit: function(seat) {
		// Player
		this.rigidBody.setMassProps(this.mass);
		
		var seatDir = new THREE.Vector3();
		seat.getWorldDirection(seatDir);
		
		var transform = this.rigidBody.getCenterOfMassTransform();
		transform.setOrigin(transform.getOrigin().op_add(new Ammo.btVector3(
			seatDir.x, 
			seatDir.y, 
			seatDir.z
		)));
		this.rigidBody.setCenterOfMassTransform(transform);
		
		// Seat
		var body = this.seat.userData.rigidBody;
		var inertia = new Ammo.btVector3(0, 0, 0);
		body.getCollisionShape().calculateLocalInertia(body.mass, inertia);
		body.setMassProps(body.mass, inertia);
		
		this.seat = null;
	}
};

var keys = [];
for(var i = 0; i < 255; i++) {
	keys.push(false);
}

var Shape = {
	SPHERE: 0,
	CUBOID: 1, 
	CYLINDER: 2, 
	CUSTOM: 3
};

var animationCounter = 0;
var prevClientCounter = 0;
var online = false;
var serverStopped = false;
var hitCount = 0;

var userId = "User5";

var objects = [];
var rigidBodies = [];
var clock = new THREE.Clock();
var delta = 0;
function animate() {
	delta = clock.getDelta();
	
	requestAnimationFrame(animate);

	var serverData = document.body.dataset.serverData;
	document.body.dataset.serverResponse = JSON.stringify({data: {pos: player.pos}, user: userId});
	document.body.dataset.online = online;
	parseServerData(serverData);
	
	if(prevClientCounter != document.body.dataset.serverClientCounter) {
		for(var i = 0; i < otherPlayers.length; i++) {
			if(otherPlayers[i].data != undefined) {
				if(otherPlayers[i].data.ip != "ME") {
					otherPlayers[i].posAnim1.x = otherPlayers[i].posAnim2.x;
					otherPlayers[i].posAnim1.y = otherPlayers[i].posAnim2.y;
					otherPlayers[i].posAnim1.z = otherPlayers[i].posAnim2.z;
					
					otherPlayers[i].posAnim2.x = otherPlayers[i].data.data.pos.x;
					otherPlayers[i].posAnim2.y = otherPlayers[i].data.data.pos.y;
					otherPlayers[i].posAnim2.z = otherPlayers[i].data.data.pos.z;
				}
			}
		}
	}
	
	var progress = delta / (500 / 1000);
	for(var i = 0; i < otherPlayers.length; i++) {
		if(otherPlayers[i].data != undefined) {
			if(otherPlayers[i].data.ip != "ME") {
				otherPlayers[i].model.position.x = otherPlayers[i].posAnim1.x * progress + otherPlayers[i].posAnim2.x * (1 - progress);
				otherPlayers[i].model.position.y = otherPlayers[i].posAnim1.y * progress + otherPlayers[i].posAnim2.y * (1 - progress) - 0.9;
				otherPlayers[i].model.position.z = otherPlayers[i].posAnim1.z * progress + otherPlayers[i].posAnim2.z * (1 - progress);
			}
		}
	}
	
	prevClientCounter = document.body.dataset.serverClientCounter;
	
	//console.log(otherPlayers);
	
	light2.position.set(20 + player.pos.x, 20 + player.pos.y, 10 + player.pos.z);
	light2.target.position.set(player.pos.x, player.pos.y, player.pos.z);
	light2.target.updateMatrixWorld();
	
	updateRigidBodies();
	player.update();
	
	renderer.render(scene, camera);
	
	// Overlay
	ctx.clearRect(0, 0, c.width, c.height);
	
	for(var i = 0; i < otherPlayers.length; i++) {
		if(otherPlayers[i].data != undefined) {
			var vec = new THREE.Vector3(otherPlayers[i].data.data.pos.x, otherPlayers[i].data.data.pos.y, otherPlayers[i].data.data.pos.z);
			vec.project(camera);
			vec.x = (vec.x * c.width * 0.5) + c.width * 0.5;
			vec.y = -(vec.y * c.height * 0.5) + c.height * 0.5;
			
			if(otherPlayers[i].data.ip != "ME" && (1 - vec.z) > 0) {
				//console.log(vec.z);
				ctx.fillStyle = "rgb(255, 255, 255)";
				ctx.font = (1 - vec.z) * 0.75 * c.height + "px Arial";
				ctx.textAlign = "center";
				ctx.fillText(otherPlayers[i].data.ip, vec.x, vec.y);
			}
		}
	}
	
	ctx.beginPath();
	ctx.arc(c.width / 2, c.height / 2, 3, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = "rgb(255, 255, 255, 0.25)";
	ctx.fill();
	
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = 0.025 * c.height + "px Arial";
	ctx.textAlign = "left";
	if(!serverStopped) {
		ctx.fillText(hitCount + " / 50000 hits", 0, 0.025 * c.height);
		ctx.fillText(Math.floor((50000 - hitCount) / (1000 / 500) / otherPlayers.length / 60) + " minutes until limit is reached", 0, 0.05 * c.height);
	} else {
		ctx.fillStyle = "rgb(255, 0, 0)";
		ctx.fillText("Server stopped", 0, 0.025 * c.height);
	}
}

function parseServerData(data) {
	if(data != undefined) {
		var lines = data.split("\n");
		if(lines.length == 1 && lines[0] >= 47500) {
			serverStopped = true;
			return;
		}
		for(var i = 0; i < lines.length; i++) {
			var pos = lines[i].indexOf(" ");
			if(pos != -1 && lines[i] != "" && !lines[i].includes("undefined") && lines[i] != " ") {
				var res = {data: JSON.parse(lines[i].substr(pos + 1)), ip: lines[i].substr(0, pos)};
				try {
					otherPlayers[i - 1].data = res;
				} catch(e) {
					
				}
			} else if(i == 0) {
				hitCount = lines[i];
			}
		}
	}
}

function updateRigidBodies() {
	physicsWorld.stepSimulation(delta, 1);
	for(var i = 0; i < objects.length; i++) {
		var body = objects[i].userData.rigidBody;
		if(body != undefined) {
			var motionState = body.getMotionState();
			if(motionState) {
				motionState.getWorldTransform(tempTransform);
				var pos = tempTransform.getOrigin();
				var quat = tempTransform.getRotation();
				objects[i].position.set(pos.x() + body.offset.x, pos.y(), pos.z() + body.offset.z);
				objects[i].translateX(body.offset.x);
				objects[i].translateY(body.offset.y);
				objects[i].translateZ(body.offset.z);
				objects[i].quaternion.set(quat.x(), quat.y(), quat.z(), quat.w());
			}
		}
    }
	
	var motionState = player.rigidBody.getMotionState();
    if(motionState) {
        motionState.getWorldTransform(tempTransform);
        var pos = tempTransform.getOrigin();
        player.pos.x = pos.x();
		player.pos.y = pos.y();
		player.pos.z = pos.z();
    }
}

function setStandardRigidBodyObjectData(data) {
	var standardData = {
		pos: {x: 0, y: 0, z: 0}, 
		rot: {x: 0, y: 0, z: 0},
		scale: {x: 1, y: 1, z: 1},  
		radius: 0.5,
		mass: 1, 
		restitution: 0.5, 
		color: "rgb(255, 255, 255)", 
		shape: Shape.CUBOID,
		friction: 0.5, 
		customGeometry: null, 
		texture: null, 
		offset: {x: 0, y: 0, z: 0}, 
		filterGroup: 1,
		filterMask: 1
	};
	for(var item in standardData) {
		if(data[item] == undefined) {
			data[item] = standardData[item];
		}
	}
	return data;
}

function createRigidBodyObject(data) {
	var data = setStandardRigidBodyObjectData(data);
	
	var obj = createObject(data);
	var body = createRigidBody(data);
	
	obj.userData.rigidBody = body;
	
	return obj;
}

function createObject(data) {
	var data = setStandardRigidBodyObjectData(data);
	
	var geometry;
	switch(data.shape) {
	case Shape.SPHERE:
		geometry = new THREE.SphereBufferGeometry(data.radius);
		break;
		
	case Shape.CUBOID:
		geometry = new THREE.BoxGeometry(data.scale.x, data.scale.y, data.scale.z);
		break;
		
	case Shape.CYLINDER:
		geometry = new THREE.CylinderGeometry(data.scale.x * 0.5, data.scale.z * 0.5, data.scale.y);
		break;
		
	case Shape.CUSTOM:
		geometry = data.customGeometry;
		break;
	}
	
	var material = new THREE.MeshPhongMaterial({color: data.color, map: data.texture});
    var obj = new THREE.Mesh(geometry, material);

    obj.position.set(data.pos.x, data.pos.y, data.pos.z);
	obj.rotation.set(data.rot.x, data.rot.y, data.rot.z);
	if(data.shape == Shape.CUSTOM) {
		obj.scale.set(data.scale.x, data.scale.y, data.scale.z);
	}
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj);
	
    objects.push(obj);
	
	return obj;
}

function createRigidBody(data) {
	var data = setStandardRigidBodyObjectData(data);
	
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(data.pos.x, data.pos.y, data.pos.z));
	var quat = new Ammo.btQuaternion();
	quat.setEulerZYX(data.rot.z, data.rot.y, data.rot.x);
	transform.setRotation(quat);
	
    var motionState = new Ammo.btDefaultMotionState(transform);
    var shape;
	switch(data.shape) {
	case Shape.SPHERE:
		shape = new Ammo.btSphereShape(data.radius)
		break;
		
	case Shape.CUBOID:
		shape = new Ammo.btBoxShape(new Ammo.btVector3(data.scale.x * 0.5, data.scale.y * 0.5, data.scale.z * 0.5))
		break;
		
	case Shape.CYLINDER:
		shape = new Ammo.btCylinderShape(new Ammo.btVector3(data.scale.x * 0.5, data.scale.y * 0.5, data.scale.z * 0.5))
		break;
		
	case Shape.CUSTOM:
		shape = new Ammo.btBoxShape(new Ammo.btVector3(data.scale.x * 0.5, data.scale.y * 0.5, data.scale.z * 0.5))
		break;
	}
    shape.setMargin( 0.05 );

    var localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(data.mass, localInertia);

    var rbInfo = new Ammo.btRigidBodyConstructionInfo(data.mass, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);
	body.setRestitution(data.restitution);
	body.setFriction(data.friction);
	body.mass = data.mass;
	body.offset = data.offset;
	
    physicsWorld.addRigidBody(body, data.filterGroup, data.filterMask);
	rigidBodies.push(body);
	
	return body;
}

function loadTexture(file) {
	return textureLoader.load("Assets/Textures/" + file);
}

function loadModel(file, onLoad) {
	var loader = new THREE.OBJLoader();
	loader.load("Assets/Models/" + file, function(object) {
		onLoad(object.children[0].geometry);
	},
	function(xhr) {}, 
	function(error) {
		console.error("Error loading model " + file);
	});
}

window.onclick = function() {
	renderer.domElement.requestPointerLock();
}

window.onmousemove = function(e) {
	mouse.pos.x = e.clientX;
	mouse.pos.y = e.clientY;
	
	mouse.vel.x = e.movementX;
	mouse.vel.y = e.movementY;
}

window.onkeydown = function(e) {
	keys[e.keyCode] = true;
}

window.onkeyup = function(e) {
	keys[e.keyCode] = false;
}

window.onmousedown = function(e) {
	mouse.keys[e.button] = true;
}

window.onmouseup = function(e) {
	mouse.keys[e.button] = false;
}