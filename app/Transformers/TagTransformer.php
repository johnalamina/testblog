<?php
namespace App\Transformers;
use App\Tag;
use Carbon\Carbon;
use League\Fractal\TransformerAbstract;
class TagTransformer extends TransformerAbstract
{

    /**
     * List of resources possible to include
     *
     * @var array
     */   protected $availableIncludes = [
        'posts','tagAuthors'
    ];

     /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(Tag $api)
    {
        return [
            'id'      => (int) $api->id,
            'name'   =>  (int) $api->user_id,
            'created_at'  => $$api->created_at,
            'updated_at'  => $$api->updated_at
        ];
    }

    /**
     * Include Tag Authors
     *
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTagAuthors(Tag $tag)
    {
        $authors = $tag->tagAuthors;

        return $this->collection($authors, new PostTransformer);
    }

    /**
     * Include Tag Posts
     *
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTags(Tag $tag)
    {
        $posts = $tag->posts;

        return $this->collection($posts, new UserTransformer);
    }
}
