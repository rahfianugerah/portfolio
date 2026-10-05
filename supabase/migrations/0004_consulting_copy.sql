-- 0004 consulting copy
--
-- The consulting site's services, principles, process steps, and prices were written into its
-- code, so changing a sentence meant a deploy, and Zoey, who now lives in the backend, could
-- not read them at all. They become studio documents here, seeded once from that code.
--
-- Each type is inserted only while no document of that type exists, so re-running this
-- changes nothing and never overwrites a studio edit. The one case it fills again is a type
-- whose every document the owner has deleted. sort_order is the position times 10.

insert into public.documents (type, data, sort_order)
select 'consultingService', item.data, item.place * 10
from (values
  (1, jsonb_build_object(
    'title', $$Full Stack App Development$$,
    'body', $$Custom applications from frontend to backend, built for performance, security, and scalability. From SaaS platforms to internal tools, I deliver production-ready solutions that solve real business problems.$$,
    'icon', 'code')),
  (2, jsonb_build_object(
    'title', $$Process Automation$$,
    'body', $$Transform manual workflows into automated systems. Reduce operational friction, eliminate human error, and free your team to focus on strategic work that drives growth.$$,
    'icon', 'zap')),
  (3, jsonb_build_object(
    'title', $$AI Integration$$,
    'body', $$Integrate artificial intelligence into your systems thoughtfully. From chatbots to predictive analytics, I help you leverage AI to enhance decision-making and customer experiences.$$,
    'icon', 'brain')),
  (4, jsonb_build_object(
    'title', $$Machine Learning Modeling$$,
    'body', $$Build predictive and classification models that turn data into actionable insights. I handle everything from data preparation to model training and deployment.$$,
    'icon', 'chart')),
  (5, jsonb_build_object(
    'title', $$Data Engineering & Analytics$$,
    'body', $$Design robust data pipelines, data warehouses, and analytics systems. Convert raw data into insights that inform strategic business decisions and drive competitive advantage.$$,
    'icon', 'database')),
  (6, jsonb_build_object(
    'title', $$Cloud Computing$$,
    'body', $$Modern cloud architecture with AWS, GCP, or Azure. I design cost-efficient, secure, and scalable infrastructure that grows with your business.$$,
    'icon', 'cloud'))
) as item(place, data)
where not exists (select 1 from public.documents where type = 'consultingService');

insert into public.documents (type, data, sort_order)
select 'principle', item.data, item.place * 10
from (values
  (1, jsonb_build_object(
    'title', $$Business-First Approach$$,
    'body', $$Technology serves your business goals. Every decision is tied to measurable outcomes and strategic value.$$)),
  (2, jsonb_build_object(
    'title', $$Complete Transparency$$,
    'body', $$Architecture, risks, timelines, and tradeoffs are always visible. No surprises. Your team stays informed throughout.$$)),
  (3, jsonb_build_object(
    'title', $$Collaborative Process$$,
    'body', $$Your engineers and leaders are part of the solution. I transfer knowledge and build internal capability alongside delivering results.$$)),
  (4, jsonb_build_object(
    'title', $$Proven Quality$$,
    'body', $$Production-ready code, robust systems, and sustainable solutions. Work built to scale and survive the real world.$$))
) as item(place, data)
where not exists (select 1 from public.documents where type = 'principle');

insert into public.documents (type, data, sort_order)
select 'processStep', item.data, item.place * 10
from (values
  (1, jsonb_build_object(
    'step', $$01$$,
    'title', $$Discovery & Assessment$$,
    'body', $$Understand your business goals, current technology landscape, pain points, and technical constraints. Identify quick wins and strategic opportunities.$$)),
  (2, jsonb_build_object(
    'step', $$02$$,
    'title', $$Strategy & Planning$$,
    'body', $$Develop a clear architecture and delivery roadmap. Define scope, timelines, resource needs, technology choices, and success metrics tied to business outcomes.$$)),
  (3, jsonb_build_object(
    'step', $$03$$,
    'title', $$Implementation & Execution$$,
    'body', $$Build your solution with transparency and regular communication. I provide weekly updates, incorporate feedback, and maintain delivery visibility throughout.$$)),
  (4, jsonb_build_object(
    'step', $$04$$,
    'title', $$Launch & Handoff$$,
    'body', $$Deploy with confidence. Comprehensive documentation, knowledge transfer, team training, and ongoing support to ensure long-term success.$$))
) as item(place, data)
where not exists (select 1 from public.documents where type = 'processStep');

-- A price carries its own dollar sign: $$$2,500$$ is the text $2,500.
insert into public.documents (type, data, sort_order)
select 'pricingTier', item.data, item.place * 10
from (values
  (1, jsonb_build_object(
    'name', $$Technical Audit$$,
    'price', $$$2,500$$,
    'cycle', $$one-time$$,
    'description', $$Perfect for understanding your current tech stack$$,
    'features', jsonb_build_array(
      $$Full system architecture review$$,
      $$Security & compliance assessment$$,
      $$Performance analysis$$,
      $$Scalability roadmap$$,
      $$Prioritized action plan$$),
    'recommended', false)),
  (2, jsonb_build_object(
    'name', $$Sprint Engagement$$,
    'price', $$$8,000$$,
    'cycle', $$2-week project$$,
    'description', $$Tackle a specific technical challenge$$,
    'features', jsonb_build_array(
      $$Dedicated consulting time$$,
      $$Solution architecture & design$$,
      $$Code review & optimization$$,
      $$Deliverables & documentation$$,
      $$Post-project advisory$$),
    'recommended', false)),
  (3, jsonb_build_object(
    'name', $$Monthly Retainer$$,
    'price', $$$4,500$$,
    'cycle', $$per month$$,
    'description', $$Ongoing strategic technology guidance$$,
    'features', jsonb_build_array(
      $$Weekly advisory sessions$$,
      $$Roadmap direction & planning$$,
      $$Technology vendor decisions$$,
      $$Team consultation & mentoring$$,
      $$Delivery oversight$$),
    'recommended', true)),
  (4, jsonb_build_object(
    'name', $$Full Stack Build$$,
    'price', $$$15,000+$$,
    'cycle', $$project-based$$,
    'description', $$End-to-end custom application development$$,
    'features', jsonb_build_array(
      $$Complete product design$$,
      $$Full-stack development$$,
      $$Backend & database setup$$,
      $$Deployment & DevOps$$,
      $$Knowledge transfer & handoff$$),
    'recommended', false)),
  (5, jsonb_build_object(
    'name', $$Automation System$$,
    'price', $$$10,000+$$,
    'cycle', $$project-based$$,
    'description', $$Transform manual processes into automated workflows$$,
    'features', jsonb_build_array(
      $$Process mapping & analysis$$,
      $$Automation architecture$$,
      $$Integration setup$$,
      $$Testing & optimization$$,
      $$Training & documentation$$),
    'recommended', false)),
  (6, jsonb_build_object(
    'name', $$AI/ML Implementation$$,
    'price', $$$12,000+$$,
    'cycle', $$project-based$$,
    'description', $$Leverage AI and machine learning for your business$$,
    'features', jsonb_build_array(
      $$Data preparation & cleanup$$,
      $$Model development & training$$,
      $$Integration into your systems$$,
      $$Performance tuning$$,
      $$Deployment & monitoring$$),
    'recommended', false)),
  (7, jsonb_build_object(
    'name', $$Data Engineering$$,
    'price', $$$8,000+$$,
    'cycle', $$project-based$$,
    'description', $$Build scalable data infrastructure$$,
    'features', jsonb_build_array(
      $$Data pipeline design$$,
      $$ETL workflow creation$$,
      $$Data warehouse setup$$,
      $$Analytics platform integration$$,
      $$Documentation & best practices$$),
    'recommended', false)),
  (8, jsonb_build_object(
    'name', $$Cloud Migration$$,
    'price', $$$9,000+$$,
    'cycle', $$project-based$$,
    'description', $$Seamlessly move to modern cloud infrastructure$$,
    'features', jsonb_build_array(
      $$Infrastructure assessment$$,
      $$Migration planning & strategy$$,
      $$Infrastructure as code setup$$,
      $$Security & compliance setup$$,
      $$Post-migration optimization$$),
    'recommended', false)),
  (9, jsonb_build_object(
    'name', $$Custom Package$$,
    'price', $$Custom$$,
    'cycle', $$let's discuss$$,
    'description', $$Tailored solutions for unique requirements$$,
    'features', jsonb_build_array(
      $$Flexible engagement model$$,
      $$Combines any services$$,
      $$Scalable pricing$$,
      $$Long-term partnership$$,
      $$Dedicated support$$),
    'recommended', false))
) as item(place, data)
where not exists (select 1 from public.documents where type = 'pricingTier');
