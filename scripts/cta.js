      // Intersection Observer for scroll animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";

            // Add extra effects on scroll into view
            setTimeout(() => {
              entry.target.querySelector(".zshimmer").style.animationPlayState =
                "running";
            }, 500);
          }
        });
      }, observerOptions);

      // Observe all cards
      document.querySelectorAll(".zreport-card").forEach((card) => {
        observer.observe(card);
      });

      // Add parallax effect on mouse move
      document.querySelectorAll(".zreport-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
        });
      });

      // Add click effects
      document.querySelectorAll(".zreport-card").forEach((card) => {
        card.addEventListener("click", () => {
          card.style.transform = "scale(0.98)";
          setTimeout(() => {
            card.style.transform = "";
          }, 150);
        });
      });

      // Animate floating elements
      function createFloatingDot() {
        const dot = document.createElement("div");
        dot.style.position = "absolute";
        dot.style.width = "4px";
        dot.style.height = "4px";
        dot.style.background = "rgba(255, 107, 157, 0.6)";
        dot.style.borderRadius = "50%";
        dot.style.left = Math.random() * 100 + "%";
        dot.style.top = "100%";
        dot.style.animation = "float 8s linear infinite";

        document.querySelector(".zfloating-elements").appendChild(dot);

        setTimeout(() => {
          dot.remove();
        }, 8000);
      }

      // Create floating dots periodically
      setInterval(createFloatingDot, 2000);
