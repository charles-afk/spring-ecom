package com.spring_ecom.server.config;

import com.spring_ecom.server.entity.Country;
import com.spring_ecom.server.entity.Product;
import com.spring_ecom.server.entity.ProductCategory;
import com.spring_ecom.server.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {
    private EntityManager entityManager;

    @Autowired
    public DataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }

    @Value("${spring.data.rest.base-path}")
    private String basePath;
    @Value("${allowed.origin}")
    private String[] allowedOrigins;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};
        // disable HTTP methods for Product and ProductCategory: PUT, POST, DELETE and PATCH
        disableHttpFor(config, theUnsupportedActions, Product.class);
        disableHttpFor(config, theUnsupportedActions, ProductCategory.class);
        disableHttpFor(config, theUnsupportedActions, Country.class);
        disableHttpFor(config, theUnsupportedActions, State.class);
        exposeIds(config);

        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(allowedOrigins);
    }

    private static void disableHttpFor(RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions, Class domainClass) {
        config.getExposureConfiguration()
                .forDomainType(domainClass).withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        List<Class> entityClasses = new ArrayList<>();
        for (EntityType tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
