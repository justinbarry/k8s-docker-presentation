---
title: Kubernetes for Docker Developers
theme: black
highlightTheme: monokai
revealOptions:
  transition: 'slide'
  transitionSpeed: 'fast'
  controls: true
  progress: true
  slideNumber: true
  hash: true
  plugins: ['RevealMermaid']
---

# Kubernetes for Docker Developers
### From Containers to Orchestration

<small>A practical guide to transitioning from Docker to Kubernetes</small>

Note: Welcome! This presentation is designed for developers comfortable with Docker who want to learn Kubernetes.

---

## Agenda

- Why Kubernetes?
- Core Concepts Translation
- Local Development Setup
- From docker-compose to K8s
- Essential kubectl Commands
- ConfigMaps, Secrets & Volumes
- Best Practices & Pitfalls
- Development Workflow

---

## Why Do We Need Kubernetes?

### Docker Challenges at Scale

- **Manual orchestration** across multiple hosts
- **No automatic failover** when containers crash
- **Complex networking** between hosts
- **Manual scaling** and load balancing
- **Configuration management** across environments
- **No built-in service discovery**

Note: Docker is great for containerization, but orchestration at scale requires additional tooling.

---

## Docker vs Kubernetes Architecture

<div style="display: flex; justify-content: space-around; margin: 20px 0;">
<div style="flex: 1; text-align: center;">

### Docker Architecture
```
    ┌──────────────┐
    │ Docker Host  │
    └──────┬───────┘
           │
    ┌──────▼───────┐
    │Docker Daemon │
    └──────┬───────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼───┐ ┌────▼───┐
│Container│ │Container│
│    1    │ │    2    │
└─────────┘ └─────────┘
```
</div>
<div style="flex: 1; text-align: center;">

### Kubernetes Architecture  
```
    ┌──────────────┐
    │ Master Node  │
    └──────┬───────┘
           │
     ┌─────┴──────┐
     │            │
┌────▼────┐  ┌───▼────┐
│Worker   │  │Worker  │
│Node 1   │  │Node 2  │
└────┬────┘  └───┬────┘
     │           │
  ┌──┴──┐    ┌──┴──┐
  │ Pod │    │ Pod │
  └─────┘    └─────┘
```
</div>
</div>

Note: Kubernetes adds a control plane that manages containers across multiple nodes automatically.

---

## Core Concepts Translation

| Docker | Kubernetes | Purpose |
|--------|------------|---------|
| Container | Pod | Smallest deployable unit |
| docker-compose.yml | Deployment/Service | Application definition |
| Docker Swarm | Kubernetes Cluster | Orchestration platform |
| Image | Image | Container image |
| Volume | PersistentVolume | Data persistence |
| Network | Service | Networking/Load balancing |
| ENV variables | ConfigMap/Secret | Configuration |

Note: Pods can contain multiple containers but usually have just one.

---

## Local Development Options

### 1. Docker Desktop
```bash
# Enable Kubernetes in Docker Desktop settings
# Single-node cluster, perfect for development
# Integrated with Docker
```

### 2. Minikube
```bash
# Install and start
brew install minikube
minikube start --driver=docker
```

### 3. kind (Kubernetes in Docker)
```bash
# Install and create cluster
brew install kind
kind create cluster --name dev
```

Note: Docker Desktop is easiest for beginners. Minikube offers more features. kind is fastest for CI/CD.

---

## Your First Pod

### Docker Run
```bash
docker run -d --name nginx -p 80:80 nginx:latest
```

### Kubernetes Pod
```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
```

```bash
kubectl apply -f pod.yaml
```

Note: Pods are ephemeral and not typically created directly. Use Deployments instead.

---

## Deployments: Production-Ready Pods

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3  # Run 3 copies
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

Note: Deployments manage ReplicaSets which manage Pods. They handle scaling and updates.

---

## Services: Load Balancing & Discovery

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx  # Matches pods with this label
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
```

### Service Types:
- **ClusterIP**: Internal only (default)
- **NodePort**: Exposes on each node's IP
- **LoadBalancer**: External load balancer
- **ExternalName**: Maps to external DNS

Note: Services provide stable networking endpoints for pods.

---

## From docker-compose to Kubernetes

### docker-compose.yml
```yaml
version: '3'
services:
  web:
    image: myapp:latest
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=postgres
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=secret
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

Note: Let's convert this docker-compose file to Kubernetes manifests.

---

## Kubernetes Equivalent (1/3)

### Application Deployment
```yaml
# app-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          value: postgres-service
```

---

## Kubernetes Equivalent (2/3)

### Database with Persistent Storage
```yaml
# postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:13
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: pgdata
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: pgdata
        persistentVolumeClaim:
          claimName: postgres-pvc
```

---

## Kubernetes Equivalent (3/3)

### Services & Storage
```yaml
# services.yaml
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  type: LoadBalancer
  ports:
  - port: 3000
    targetPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
---
# postgres-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

---

## Essential kubectl Commands

| Docker Command | kubectl Equivalent | Purpose |
|----------------|-------------------|---------|
| `docker ps` | `kubectl get pods` | List running containers/pods |
| `docker ps -a` | `kubectl get pods -A` | List all containers/pods |
| `docker logs <container>` | `kubectl logs <pod>` | View logs |
| `docker exec -it <container> bash` | `kubectl exec -it <pod> -- bash` | Execute command |
| `docker stop <container>` | `kubectl delete pod <pod>` | Stop container/pod |
| `docker build -t <tag> .` | Build with Docker, push to registry | Build image |
| `docker run <image>` | `kubectl run <name> --image=<image>` | Run container/pod |
| `docker-compose up` | `kubectl apply -f <directory>` | Deploy stack |
| `docker-compose down` | `kubectl delete -f <directory>` | Remove stack |

---

## More kubectl Commands

```bash
# Get resources
kubectl get deployments
kubectl get services
kubectl get nodes
kubectl get all  # Shows most resources

# Describe (detailed info)
kubectl describe pod <pod-name>
kubectl describe deployment <deployment-name>

# Apply changes
kubectl apply -f manifest.yaml
kubectl apply -f ./k8s/  # Apply all files in directory

# Scale
kubectl scale deployment <name> --replicas=5

# Port forwarding (like docker -p)
kubectl port-forward pod/<pod-name> 8080:80

# Watch resources
kubectl get pods -w  # Watch for changes
```

Note: kubectl is your primary interface to Kubernetes. Master these commands!

---

## ConfigMaps: Application Configuration

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.properties: |
    server.port=8080
    database.url=postgres://db:5432
  LOG_LEVEL: "info"
  ENVIRONMENT: "production"
```

### Using ConfigMaps in Pods
```yaml
spec:
  containers:
  - name: app
    env:
    - name: LOG_LEVEL
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: LOG_LEVEL
    volumeMounts:
    - name: config
      mountPath: /etc/config
  volumes:
  - name: config
    configMap:
      name: app-config
```

Note: ConfigMaps store non-sensitive configuration data.

---

## Secrets: Sensitive Data

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  # Values must be base64 encoded
  db-password: cGFzc3dvcmQxMjM=  # echo -n 'password123' | base64
  api-key: YWJjZGVmZ2hpams=
```

### Using Secrets
```yaml
spec:
  containers:
  - name: app
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: db-password
```

```bash
# Create secret from command line
kubectl create secret generic app-secrets \
  --from-literal=db-password=password123 \
  --from-file=ssh-key=/path/to/key
```

Note: Secrets are base64 encoded, not encrypted. Use external secret managers for production.

---

## Volumes: Data Persistence

### Volume Types

```yaml
spec:
  containers:
  - name: app
    volumeMounts:
    - name: cache
      mountPath: /cache
    - name: config
      mountPath: /etc/config
    - name: data
      mountPath: /data
  volumes:
  - name: cache
    emptyDir: {}  # Temporary, deleted with pod
  - name: config
    configMap:
      name: app-config
  - name: data
    persistentVolumeClaim:
      claimName: data-pvc  # Persistent storage
```

Note: emptyDir for temp storage, PVC for persistent data, ConfigMap/Secret for config.

---

## Ingress: External Access

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 3000
```

Note: Ingress controllers handle HTTP/HTTPS routing. NGINX is most common.

---

## Namespaces: Environment Isolation

```
┌──────────────────────────────────────────────┐
│           Kubernetes Cluster                  │
│                                               │
│  ┌────────────────────────────────────────┐  │
│  │         dev namespace                   │  │
│  │  ┌──────┐  ┌──────┐  ┌──────────┐    │  │
│  │  │ App  │  │  DB  │  │ Services │    │  │
│  │  │ Pods │  │ Pods │  └──────────┘    │  │
│  │  └──────┘  └──────┘                   │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌────────────────────────────────────────┐  │
│  │       staging namespace                 │  │
│  │  ┌──────┐  ┌──────┐  ┌──────────┐    │  │
│  │  │ App  │  │  DB  │  │ Services │    │  │
│  │  │ Pods │  │ Pods │  └──────────┘    │  │
│  │  └──────┘  └──────┘                   │  │
│  └────────────────────────────────────────┘  │
│                                               │
│  ┌────────────────────────────────────────┐  │
│  │         prod namespace                  │  │
│  │  ┌──────┐  ┌──────┐  ┌──────────┐    │  │
│  │  │ App  │  │  DB  │  │ Services │    │  │
│  │  │ Pods │  │ Pods │  └──────────┘    │  │
│  │  └──────┘  └──────┘                   │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

```bash
# Create and use namespaces
kubectl create namespace dev
kubectl apply -f app.yaml -n dev
kubectl get pods -n dev
```

Note: Namespaces provide logical isolation within a cluster.

---

## Health Checks & Probes

```yaml
spec:
  containers:
  - name: app
    image: myapp:latest
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
    startupProbe:
      httpGet:
        path: /started
        port: 8080
      failureThreshold: 30
      periodSeconds: 10
```

- **Liveness**: Restarts if unhealthy
- **Readiness**: Removes from service if not ready
- **Startup**: Allows slow-starting containers

Note: Probes ensure your application is healthy and ready to serve traffic.

---

## Resource Management

```yaml
spec:
  containers:
  - name: app
    resources:
      requests:  # Minimum guaranteed
        memory: "256Mi"
        cpu: "250m"  # 0.25 CPU
      limits:    # Maximum allowed
        memory: "512Mi"
        cpu: "500m"  # 0.5 CPU
```

### Best Practices:
- Always set requests and limits
- Start conservative, monitor, adjust
- Use HorizontalPodAutoscaler for auto-scaling

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## Rolling Updates & Rollbacks

```yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max pods above replicas during update
      maxUnavailable: 1  # Max pods unavailable during update
```

```bash
# Update image
kubectl set image deployment/app app=myapp:v2

# Check rollout status
kubectl rollout status deployment/app

# Rollback if needed
kubectl rollout undo deployment/app

# View rollout history
kubectl rollout history deployment/app

# Rollback to specific revision
kubectl rollout undo deployment/app --to-revision=2
```

Note: Kubernetes handles zero-downtime deployments automatically.

---

## Development Workflow

```
┌────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Write Code │────▶│ Build Image  │────▶│ Push to Registry│
└────────────┘     └──────────────┘     └─────────────────┘
      ▲                                           │
      │                                           ▼
      │                                  ┌─────────────────┐
      │                                  │Update Manifests │
      │                                  └─────────────────┘
      │                                           │
      │                                           ▼
      │                                  ┌─────────────────┐
      │            ┌──────┐             │ kubectl apply   │
      └────No──────│Works?│             └─────────────────┘
                   └──────┘                       │
                      ▲ │                         ▼
                      │ └──Yes──▶ Commit  ┌─────────────────┐
                      └───────────────────│     Test        │
                                         └─────────────────┘
```

### Tools to Speed Up Development:
- **Skaffold**: Automates build-push-deploy
- **Telepresence**: Local development with remote cluster
- **Tilt**: Smart rebuilds and live updates
- **Lens**: Kubernetes IDE

Note: These tools significantly improve the development experience with Kubernetes.

---

## Best Practices

### ✅ DO:
- Use Deployments, not bare Pods
- Set resource requests/limits
- Use health checks
- Store secrets in Secret objects
- Use namespaces for isolation
- Label everything consistently
- Use init containers for setup
- Implement graceful shutdown

### ❌ DON'T:
- Hardcode configuration
- Use `latest` tag in production
- Store secrets in ConfigMaps
- Ignore resource limits
- Run containers as root
- Use hostNetwork unless necessary

---

## Common Pitfalls & Solutions

| Problem | Solution |
|---------|----------|
| Pod stuck in Pending | Check resources, node capacity |
| CrashLoopBackOff | Check logs, fix startup issues |
| ImagePullBackOff | Verify image exists, check credentials |
| Service not reachable | Check selectors, ports, endpoints |
| Volume mount fails | Check PVC status, storage class |
| Config changes not applied | Restart pods or use mounted ConfigMaps |
| OOMKilled | Increase memory limits |

```bash
# Debugging commands
kubectl describe pod <pod>
kubectl logs <pod> --previous
kubectl get events --sort-by='.lastTimestamp'
kubectl exec -it <pod> -- sh
```

---

## Security Best Practices

```yaml
# security-context.yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
```

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: app-netpol
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

---

## Monitoring & Observability

### Key Metrics to Monitor:
- Pod CPU/Memory usage
- Request rate and latency
- Error rates
- Pod restarts
- Node capacity

### Tools:
- **Prometheus + Grafana**: Metrics
- **ELK/EFK Stack**: Logs
- **Jaeger**: Distributed tracing
- **kubectl top**: Quick resource check

```bash
# Quick monitoring
kubectl top nodes
kubectl top pods
kubectl get pods --all-namespaces | grep -v Running
```

---

## CI/CD with Kubernetes

```yaml
# .gitlab-ci.yml example
deploy:
  stage: deploy
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/app
```

### GitOps Approach:
1. Code change → Git push
2. CI builds & pushes image
3. Update manifest in Git
4. ArgoCD/Flux syncs to cluster

Note: GitOps provides better audit trail and rollback capabilities.

---

## Quick Reference Card

```bash
# Cluster Info
kubectl cluster-info
kubectl get nodes

# Contexts (Multiple Clusters)
kubectl config get-contexts
kubectl config use-context <name>

# Quick Deployment
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=LoadBalancer

# Debugging
kubectl get events -w
kubectl describe pod <pod>
kubectl logs <pod> -f --tail=100
kubectl exec -it <pod> -- bash

# Cleanup
kubectl delete deployment nginx
kubectl delete service nginx
kubectl delete all --all -n <namespace>
```

---

## Migration Checklist

- [ ] Containerize application (if not already)
- [ ] Create Kubernetes manifests
- [ ] Set up ConfigMaps/Secrets
- [ ] Define resource requirements
- [ ] Add health checks
- [ ] Configure persistent storage
- [ ] Set up service discovery
- [ ] Implement monitoring
- [ ] Plan rollback strategy
- [ ] Document runbooks

---

## Resources & Next Steps

### Official Documentation
- [Kubernetes.io](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

### Interactive Learning
- [Kubernetes Playground](https://labs.play-with-k8s.com/)
- [Katacoda Scenarios](https://katacoda.com/courses/kubernetes)

### Tools
- [Lens](https://k8slens.dev/) - Kubernetes IDE
- [k9s](https://k9scli.io/) - Terminal UI
- [Helm](https://helm.sh/) - Package manager

### Books
- "Kubernetes in Action" by Marko Lukša
- "The Kubernetes Book" by Nigel Poulton

---

## Thank You!

### Key Takeaways:
- Kubernetes automates container orchestration
- Pods → Deployments → Services → Ingress
- kubectl is your friend
- Start simple, iterate
- Use namespaces for isolation
- Always set resource limits
- Monitor everything

### Questions?

<small>Remember: Every expert was once a beginner. Keep practicing!</small>

---

## Bonus: Sample Application

Complete example at: [github.com/example/k8s-docker-demo](https://github.com/)

```bash
# Clone and deploy
git clone <repo>
cd k8s-docker-demo
kubectl apply -f k8s/
kubectl port-forward service/web 8080:80
# Open http://localhost:8080
```

Includes:
- Multi-tier application
- Database with persistence
- ConfigMaps and Secrets
- Horizontal autoscaling
- Health checks
- Monitoring setup